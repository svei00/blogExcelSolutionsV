import { useCallback, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// The ONLY Firebase upload code (extracted from CustomReactQuill.jsx and
// CreatePost.jsx, which each had their own copy — see REBUILD_PLAN 2.4).
export default function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setProgress(0);
      setError(null);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
