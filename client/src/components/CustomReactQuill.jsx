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
const CheckBlot = ReactQuill.Quill.import("formats/list");

class CheckList extends CheckBlot {
  static create(value) {
    const node = super.create(value);
    node.classList.add("ql-check-list");
    return node;
  }
}

CheckList.blotName = "check-list";
CheckList.tagName = "UL";

// Register the new format
ReactQuill.Quill.register(CheckList);

/**
 * CustomReactQuill - A rich text editor component with image upload and custom list formatting
 * @param {string} value - Initial content of the editor
 * @param {function} onChange - Callback function when content changes
 */
const CustomReactQuill = ({ value, onChange }) => {
  // State management
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState(value || "");
  const quillRef = React.useRef(null);

  /**
   * Sanitizes HTML content to prevent XSS and remove unwanted formatting
   */
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

  /**
   * Handles image upload process using Firebase Storage
   */
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
            const range = editor.getSelection();
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

  // Supported formats
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

  // Editor configuration
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
          if (value === "check") {
            const quill = quillRef.current.getEditor();
            const format = quill.getFormat();
            if (format["check-list"]) {
              quill.format("check-list", false);
            } else {
              quill.format("check-list", true);
            }
          }
        },
      },
    },
    clipboard: {
      matchVisual: false,
    },
  };

  // Add custom CSS for check lists
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

      /* Custom list styles */
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
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  /**
   * Handles content changes in the editor
   */
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
        required
        value={text}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default CustomReactQuill;
