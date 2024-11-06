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

  // Custom clipboard handling
  const handlePaste = (e) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        // Strip all formatting from pasted content
        delta.ops = delta.ops.map((op) => {
          if (op.insert) {
            return { insert: op.insert };
          }
          return op;
        });
        return delta;
      });
    }
  };

  // Custom formats for bullet points
  const bulletStyles = {
    whiteDot: "○",
    blackDot: "•",
    square: "■",
    check: "✓",
  };

  // Register custom formats
  useEffect(() => {
    if (quillRef.current) {
      const Quill = quillRef.current.getEditor().constructor;
      const Block = Quill.import("blots/block");

      // Register custom bullet classes
      Object.entries(bulletStyles).forEach(([name, symbol]) => {
        class CustomBullet extends Block {
          static create(value) {
            const node = super.create(value);
            node.setAttribute("data-bullet", symbol);
            return node;
          }
        }
        CustomBullet.blotName = `bullet-${name}`;
        CustomBullet.tagName = "div";
        Quill.register(CustomBullet);
      });
    }
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [
          { list: "bullet" },
          { list: "ordered" },
          { list: "check" },
          { "bullet-whiteDot": bulletStyles.whiteDot },
          { "bullet-blackDot": bulletStyles.blackDot },
          { "bullet-square": bulletStyles.square },
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
      },
    },
    clipboard: {
      matchVisual: false,
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
        "bullet-whiteDot": "White dot bullet",
        "bullet-blackDot": "Black dot bullet",
        "bullet-square": "Square bullet",
        "bullet-check": "Check bullet",
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
      // Add paste event listener
      quillRef.current.getEditor().root.addEventListener("paste", handlePaste);
    }

    return () => {
      if (quillRef.current) {
        quillRef.current
          .getEditor()
          .root.removeEventListener("paste", handlePaste);
      }
    };
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
