import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// Define the imageHandler function
const imageHandler = async function () {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", "image/*");
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (!file) {
      return;
    }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // You can add a progress indicator here if you want
      },
      (error) => {
        console.error("Image upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const quill = this.quill;
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", downloadURL);
      }
    );
  };
};

// Toolbar configuration with alignment options
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
    handlers: {
      image: imageHandler,
    },
  },
};

const CustomReactQuill = ({ value, onChange }) => {
  return (
    <ReactQuill
      theme="snow"
      placeholder="Create a story..."
      className="h-72 mb-12"
      required
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
};

export default CustomReactQuill;
