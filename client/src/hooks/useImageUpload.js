import { useCallback, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { app } from "../firebase";
import logoUrl from "../assets/LogoExcelv2_Trim_803x230.png";

// Fetched/decoded once and reused for every image in a session, instead
// of re-fetching the logo asset per upload.
let logoBitmapPromise = null;
const getLogoBitmap = () => {
  if (!logoBitmapPromise) {
    logoBitmapPromise = fetch(logoUrl)
      .then((res) => res.blob())
      .then((blob) => createImageBitmap(blob));
  }
  return logoBitmapPromise;
};

// Stamps the logo + site URL in the bottom-right corner at low opacity -
// noticeable enough to prove provenance if a screenshot gets reposted
// elsewhere, but faint enough to stay legible through: these are Excel
// tutorial screenshots, so cell references and formulas have to stay
// readable, which is why this is a single corner mark rather than a
// diagonal repeating tile (that would sit on top of the exact content
// readers need to read). Applies to every upload through this hook -
// cover images and in-content editor screenshots alike, since protecting
// the tutorial content itself is the actual point, not just the
// thumbnail. Never blocks the upload if it fails for any reason (missing
// canvas support, a decode error, etc.) - same fallback philosophy as
// the compression step below.
async function applyWatermark(file) {
  const [imageBitmap, logoBitmap] = await Promise.all([
    createImageBitmap(file),
    getLogoBitmap(),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = imageBitmap.width;
  canvas.height = imageBitmap.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0);

  // Logo width scales with the image, capped so it stays a corner mark
  // even on a very wide screenshot.
  const logoWidth = Math.min(canvas.width * 0.18, 160);
  const logoHeight = logoWidth * (logoBitmap.height / logoBitmap.width);
  const padding = Math.max(12, canvas.width * 0.015);
  const fontSize = Math.max(11, Math.round(logoHeight * 0.4));

  ctx.globalAlpha = 0.22;
  ctx.font = `600 ${fontSize}px system-ui, sans-serif`;
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";
  // A thin dark stroke behind a white fill keeps the mark legible on
  // both light (white cells) and dark screenshot backgrounds - either
  // color alone disappears against a matching background.
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = Math.max(1, fontSize * 0.08);
  ctx.fillStyle = "#ffffff";

  const text = "excelsolutionsv.com";
  const textX = canvas.width - padding;
  const textY = canvas.height - padding;
  ctx.strokeText(text, textX, textY);
  ctx.fillText(text, textX, textY);

  const logoX = canvas.width - padding - logoWidth;
  const logoY = textY - fontSize * 1.3 - logoHeight;
  ctx.drawImage(logoBitmap, logoX, logoY, logoWidth, logoHeight);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Watermark canvas produced no blob"));
          return;
        }
        resolve(new File([blob], file.name, { type: file.type || "image/png" }));
      },
      file.type || "image/png",
      0.92
    );
  });
}

// The ONLY Firebase upload code (extracted from CustomReactQuill.jsx and
// CreatePost.jsx, which each had their own copy — see REBUILD_PLAN 2.4).
export default function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    // Resize/compress before it ever reaches Firebase (REBUILD_PLAN 4.3)
    // - cover images and in-editor screenshots were being uploaded at
    // whatever size the phone/screenshot tool produced, sometimes several
    // MB at full resolution the page never displays. If compression fails
    // for any reason, fall back to the original file rather than blocking
    // the upload entirely.
    let fileToUpload = file;
    try {
      fileToUpload = await imageCompression(file, {
        maxWidthOrHeight: 1600,
        maxSizeMB: 2,
        useWebWorker: true,
      });
    } catch {
      fileToUpload = file;
    }

    // Watermark AFTER compression, at the final resolution, so the mark's
    // size (scaled off canvas.width) is stable relative to the image
    // that's actually uploaded. Never blocks the upload if it fails.
    try {
      fileToUpload = await applyWatermark(fileToUpload);
    } catch {
      // Keep fileToUpload as-is (compressed, unwatermarked).
    }

    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + fileToUpload.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        },
        (err) => {
          setUploading(false);
          setError("Image upload failed");
          reject(err);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          resolve(downloadURL);
        }
      );
    });
  }, []);

  return { uploadImage, progress, uploading, error };
}
