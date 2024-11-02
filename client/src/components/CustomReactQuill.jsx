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
  // State management for file uploads and editor content
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState(value || "");

  // Function to clean HTML content by removing unwanted tags and attributes
  const cleanHTML = (input) => {
    let content = input;
    // Remove Microsoft Word and other XML-based formatting
    content = content.replace(/<\/?[^>]+(xml|w:|o:|v:|m:)[^>]*>/gi, "");
    // Remove style tags and their contents
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Remove inline styles
    content = content.replace(/\s*style="[^"]*"/gi, "");
    // Remove class attributes
    content = content.replace(/\s*class="[^"]*"/gi, "");
    // Remove span tags
    content = content.replace(/<\/?span[^>]*>/gi, "");
    // Convert div tags to line breaks
    content = content.replace(/<div[^>]*>/gi, "");
    content = content.replace(/<\/div>/gi, "<br>");
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, "");
    // Remove conditional comments
    content = content.replace(/<!\[.*?\]>/g, "");
    // Remove extra line breaks
    content = content.replace(/\n\s*\n/g, "\n");
    // Remove extra spaces
    content = content.replace(/  +/g, " ");
    return content.trim();
  };

  // Handle image uploads with Firebase Storage
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        setIsUploading(true);
        setUploadProgress(0);

        // Initialize Firebase Storage and create reference
        const storage = getStorage(app);
        const fileName = new Date().getTime() + "-" + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        // Handle upload state changes
        uploadTask.on(
          "state_changed",
          // Progress handler
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          // Error handler
          (error) => {
            console.error("Image upload failed:", error);
            setIsUploading(false);
          },
          // Completion handler
          async () => {
            try {
              // Get download URL and insert image into editor
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
      } catch (error) {
        console.error("Error initiating upload:", error);
        setIsUploading(false);
      }
    };
  }, []);

  // Handle paste events to clean pasted content
  const handlePaste = (e) => {
    const quill = quillRef.current.getEditor();
    e.preventDefault();
    // Try to get HTML content first, fall back to plain text
    let pastedContent =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");
    const cleanedContent = cleanHTML(pastedContent);
    const range = quill.getSelection();
    // Safely insert cleaned HTML content
    quill.clipboard.dangerouslyPasteHTML(range.index, cleanedContent);
  };

  // Configure Quill editor modules
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
        [{ align: ["", "center", "right", "justify"] }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
    clipboard: {
      matchVisual: false,
      // Configure clipboard matchers for better paste handling
      matchers: [
        [
          "br",
          (node, delta) => {
            return delta.compose(
              new Delta().retain(delta.length(), { linebreak: true })
            );
          },
        ],
      ],
    },
  };

  // Define allowed formats in the editor
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "check",
    "script",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "linebreak",
  ];

  // Create reference to Quill editor instance
  const quillRef = React.useRef(null);

  // Set up tooltips for toolbar buttons
  useEffect(() => {
    const setTooltips = () => {
      if (!quillRef.current) return;

      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      const toolbarButtons = toolbar.container.querySelectorAll("button");

      // Define tooltips for each button type
      const tooltips = {
        bold: "Bold text",
        italic: "Italic text",
        underline: "Underline text",
        strike: "Strikethrough text",
        list: "List",
        "list-ordered": "Numbered List",
        "list-bullet": "Bullet List",
        "list-check": "Checklist",
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

      // Apply tooltips to buttons
      toolbarButtons.forEach((button) => {
        const format = button.className.split("-").pop();
        if (tooltips[format]) {
          button.title = tooltips[format];
        }
      });
    };

    setTooltips();
  }, []);

  // Add custom styles for checklist
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ql-container .ql-editor ul[data-checked="true"] > li::before {
        content: '☑';
      }
      .ql-container .ql-editor ul[data-checked="false"] > li::before {
        content: '☐';
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove styles when component unmounts
    return () => {
      style.remove();
    };
  }, []);

  // Handle changes to editor content
  const handleChange = (content) => {
    setText(content);
    if (onChange) {
      // Clean the HTML before passing it to the parent component
      const cleanedContent = cleanHTML(content);
      onChange(cleanedContent);
    }
  };

  return (
    <div className="relative">
      {/* Upload progress overlay */}
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

      {/* ReactQuill editor component */}
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
        onPaste={handlePaste}
      />
    </div>
  );
};

export default CustomReactQuill;
