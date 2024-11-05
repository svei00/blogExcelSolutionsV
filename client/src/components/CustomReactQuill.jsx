import React, { useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Check } from "lucide-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

// Register custom blot for check lists
const Quill = ReactQuill.Quill;
const CheckBlot = Quill.import("formats/list");

class CheckList extends CheckBlot {
  static create(value) {
    const node = super.create(value);
    node.classList.add("ql-check-list");
    return node;
  }

  static formats(node) {
    return node.tagName === this.tagName ? true : undefined;
  }
}

CheckList.blotName = "check-list";
CheckList.tagName = "UL";

// Register the new format
Quill.register(CheckList);

const CustomReactQuill = ({ value, onChange }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState(value || "");
  const quillRef = React.useRef(null);

  const cleanHTML = (input) => {
    if (!input) return "";
    let content = input;
    content = content.replace(/<\/?[^>]+(xml|w:|o:|v:|m:)[^>]*>/gi, "");
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    content = content.replace(/\s*style="[^"]*"/gi, "");
    content = content.replace(/\s*class="[^"]*"/gi, "");
    content = content.replace(/<\/?span[^>]*>/gi, "");
    content = content.replace(/<div[^>]*>/gi, "");
    content = content.replace(/<\/div>/gi, "<br>");
    content = content.replace(/<!--[\s\S]*?-->/g, "");
    content = content.replace(/\n\s*\n/g, "\n");
    content = content.replace(/  +/g, " ");
    return content.trim();
  };

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
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection(true);
            editor.insertEmbed(range.index, "image", downloadURL);
          } catch (error) {
            console.error("Error getting download URL:", error);
          } finally {
            setIsUploading(false);
          }
        }
      );
    };
  }, []);

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "check-list",
    "bullet",
    "script",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
  ];

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
        list: function (value) {
          const quill = quillRef.current.getEditor();
          const format = quill.getFormat();

          if (value === "check") {
            quill.format("list", false); // First remove any existing list format
            quill.format("check-list", !format["check-list"]); // Toggle check-list
          } else {
            quill.format("check-list", false); // Remove check-list if exists
            quill.format("list", value); // Apply regular list
          }
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
    keyboard: {
      bindings: {
        // Add keyboard handlers if needed
      },
    },
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ql-check-list {
        list-style: none;
        padding-left: 0;
      }
      
      .ql-check-list li {
        position: relative;
        padding-left: 1.5em;
        margin-bottom: 0.5em;
      }
      
      .ql-check-list li:before {
        content: "";
        position: absolute;
        left: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.2em;
        height: 1.2em;
      }

      .ql-check-list li[data-checked="true"]:before {
        content: "✓";
        color: #4CAF50;
      }

      .ql-check-list li[data-checked="false"]:before {
        content: "□";
      }

      .ql-editor ol {
        counter-reset: list-counter;
      }
      
      .ql-editor ol li {
        counter-increment: list-counter;
        display: block;
      }

      .ql-editor ol li:before {
        content: counter(list-counter) ". ";
      }

      .ql-editor {
        min-height: 200px;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (content) => {
    setText(content);
    if (onChange) {
      const cleanedContent = cleanHTML(content);
      onChange(cleanedContent);
    }
  };

  return (
    <div className="relative">
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="w-64 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
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
        className="h-72 mb-12 border-greenEx dark:text-white"
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        preserveWhitespace
      />
    </div>
  );
};

export default CustomReactQuill;
