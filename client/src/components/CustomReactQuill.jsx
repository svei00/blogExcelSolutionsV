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

  // Enhanced format cleaner
  const formatCleaner = useCallback(() => {
    const editor = quillRef.current.getEditor();
    const range = editor.getSelection();
    if (range) {
      if (range.length === 0) {
        // Clean entire document if no selection
        editor.removeFormat(0, editor.getLength());
      } else {
        // Clean only selected text
        editor.removeFormat(range.index, range.length);
      }
    }
  }, []);

  // Custom list styles
  useEffect(() => {
    if (quillRef.current) {
      const Quill = quillRef.current.getEditor().constructor;

      // Register custom list styles
      const List = Quill.import("formats/list");

      class CustomList extends List {
        static create(value) {
          const node = super.create(value);
          node.setAttribute("data-list-type", value);
          return node;
        }
      }

      Quill.register("formats/list", CustomList, true);
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [
          { list: "bullet" }, // Default bullet (•)
          { list: "ordered" }, // Default numbers (1.)
          { list: "ordered-paren" }, // Numbers with parenthesis (1))
          { list: "lower-alpha" }, // Lowercase letters (a.)
          { list: "lower-alpha-paren" }, // Lowercase letters with parenthesis (a))
          { list: "lower-roman" }, // Lowercase Roman numerals (i.)
          { list: "upper-alpha" }, // Uppercase letters (A.)
          { list: "circle" }, // White circle (○)
          { list: "square" }, // Square (■)
          { list: "check" }, // Check (✓)
        ],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],
        [{ align: [] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
        clean: formatCleaner,
      },
    },
  };

  const quillRef = React.useRef(null);

  // Custom CSS for list styles
  useEffect(() => {
    if (quillRef.current) {
      const style = document.createElement("style");
      style.innerHTML = `
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="circle"]::before {
          content: "○";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="square"]::before {
          content: "■";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="check"]::before {
          content: "✓";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="ordered-paren"]::before {
          content: "1)";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="lower-alpha"]::before {
          content: "a.";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="lower-alpha-paren"]::before {
          content: "a)";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="lower-roman"]::before {
          content: "i.";
        }
        .ql-snow .ql-picker.ql-list .ql-picker-item[data-value="upper-alpha"]::before {
          content: "A.";
        }
        ul[data-list-type="circle"] {
          list-style-type: circle;
        }
        ul[data-list-type="square"] {
          list-style-type: square;
        }
        ul[data-list-type="check"] {
          list-style-type: none;
        }
        ul[data-list-type="check"] li::before {
          content: "✓";
          margin-right: 0.5em;
        }
        ol[data-list-type="ordered-paren"] {
          list-style-type: decimal;
        }
        ol[data-list-type="ordered-paren"] li::marker {
          content: counter(list-item) ") ";
        }
        ol[data-list-type="lower-alpha"] {
          list-style-type: lower-alpha;
        }
        ol[data-list-type="lower-alpha-paren"] {
          list-style-type: lower-alpha;
        }
        ol[data-list-type="lower-alpha-paren"] li::marker {
          content: counter(list-item, lower-alpha) ") ";
        }
        ol[data-list-type="lower-roman"] {
          list-style-type: lower-roman;
        }
        ol[data-list-type="upper-alpha"] {
          list-style-type: upper-alpha;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

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
        "code-block": "Insert code block",
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
        className="h-72 mb-12 border-greenEx dark:text-white"
        required
        value={value}
        onChange={onChange}
        modules={modules}
      />
    </div>
  );
};

export default CustomReactQuill;
