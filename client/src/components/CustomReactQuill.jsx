import React, { useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const CustomReactQuill = ({ value, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsUploading(true);
      setUploadProgress(0);

      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Image upload failed:", error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", downloadURL);
          setIsUploading(false);
        }
      );
    };
  }, []);

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

  const quillRef = React.useRef(null);

  useEffect(() => {
    const setTooltips = () => {
      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      const toolbarButtons = toolbar.container.querySelectorAll("button");

      const tooltips = {
        bold: "Bold text",
        italic: "Italic text",
        underline: "Underline text",
        strike: "Strikethrough text",
        list: "List",
        script: "Subscript/Superscript",
        indent: "Indent",
        direction: "Text direction",
        align: "Text alignment",
        link: "Insert link",
        image: "Insert image",
        video: "Insert video",
        clean: "Remove formatting",
      };

      toolbarButtons.forEach((button) => {
        const format = button.className.split("-").pop();
        if (tooltips[format]) {
          button.title = tooltips[format];
        }
      });
    };

    if (quillRef.current) {
      setTooltips();
    }
  }, []);

  return (
    <div className="relative">
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-center mt-2">{uploadProgress.toFixed(0)}%</p>
          </div>
        </div>
      )}

      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder="Create a story..."
        className="h-72 mb-12 border-greenEx"
        required
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
};

export default CustomReactQuill;
