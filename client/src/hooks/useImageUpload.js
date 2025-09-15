import { useCallback, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { app } from "../firebase";

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
