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

/**
 * CustomReactQuill - A rich text editor component with image upload capabilities
 * @param {string} value - Initial content of the editor
 * @param {function} onChange - Callback function when content changes
 *
 * Troubleshooting:
 * - If images don't upload: Check Firebase storage rules and app initialization
 * - If toolbar missing options: Verify modules configuration
 * - If content not updating: Check onChange handler and parent component state
 */
const CustomReactQuill = ({ value, onChange }) => {
  // Track upload progress and editor content state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [text, setText] = useState(value || "");

  /**
   * Sanitizes HTML content to prevent XSS and remove unwanted formatting
   * @param {string} input - Raw HTML content
   * @returns {string} - Cleaned HTML content
   *
   * Debug: If content looks wrong after pasting, check these regex patterns
   */
  const cleanHTML = (input) => {
    if (!input) return "";
    let content = input;
    // Remove MS Word formatting
    content = content.replace(/<\/?[^>]+(xml|w:|o:|v:|m:)[^>]*>/gi, "");
    // Remove style tags and contents
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    // Remove inline styles
    content = content.replace(/\s*style="[^"]*"/gi, "");
    // Remove class attributes
    content = content.replace(/\s*class="[^"]*"/gi, "");
    // Clean up spans
    content = content.replace(/<\/?span[^>]*>/gi, "");
    // Convert divs to breaks
    content = content.replace(/<div[^>]*>/gi, "");
    content = content.replace(/<\/div>/gi, "<br>");
    // Remove comments
    content = content.replace(/<!--[\s\S]*?-->/g, "");
    // Clean up whitespace
    content = content.replace(/\n\s*\n/g, "\n");
    content = content.replace(/  +/g, " ");
    return content.trim();
  };

  /**
   * Handles image upload process using Firebase Storage
   * Steps:
   * 1. Create file input
   * 2. Handle file selection
   * 3. Upload to Firebase
   * 4. Insert image URL into editor
   *
   * Debug: Check console for upload errors
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

      // Initialize Firebase upload
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Handle upload states
      uploadTask.on(
        "state_changed",
        // Progress updates
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        // Error handling
        (error) => {
          console.error("Image upload failed:", error);
          setIsUploading(false);
        },
        // Success handling
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

  /**
   * Editor toolbar configuration
   * Add/remove features by modifying the container array
   * Format: [category, option]
   */
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
      },
    },
  };

  // Reference to the Quill editor instance
  const quillRef = React.useRef(null);

  /**
   * Handles content changes in the editor
   * Cleans HTML before passing to parent component
   */
  const handleChange = (content) => {
    setText(content);
    if (onChange) {
      const cleanedContent = cleanHTML(content);
      onChange(cleanedContent);
    }
  };

  /**
   * Sets up tooltips for toolbar buttons
   * Debug: If tooltips don't appear, check toolbar button selectors
   */
  useEffect(() => {
    const setTooltips = () => {
      if (!quillRef.current) return;

      const toolbar = quillRef.current.getEditor().getModule("toolbar");
      const toolbarButtons = toolbar.container.querySelectorAll("button");

      // Tooltip text for each button type
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

      {/* Main editor component */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder="Create a story..."
        className="h-72 mb-12 border-greenEx dark:text-white"
        required
        value={text}
        onChange={handleChange}
        modules={modules}
      />
    </div>
  );
};

export default CustomReactQuill;
