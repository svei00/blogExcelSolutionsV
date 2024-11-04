import React, { useState, useCallback, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Highlighter,
  Paintbrush,
} from "lucide-react";

const CustomWordEditor = ({ value, onChange }) => {
  const [text, setText] = useState(value || "");
  const quillRef = React.useRef(null);

  // Custom font sizes to match Word-like editing
  const fontSizes = [
    "8px",
    "9px",
    "10px",
    "11px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "30px",
    "36px",
    "48px",
    "60px",
    "72px",
    "96px",
  ];

  // Custom formats allowing Word-like styling
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "align",
    "color",
    "background",
    "script",
    "link",
  ];

  // Define custom styles similar to Word
  const customStyles = {
    Normal: { size: "12px", font: "Arial" },
    "No Spacing": { size: "12px", font: "Arial", lineHeight: "1" },
    "Heading 1": { size: "16px", font: "Arial", bold: true },
    "Heading 2": { size: "14px", font: "Arial", bold: true },
    Title: { size: "26px", font: "Arial", bold: true },
  };

  // Editor modules configuration
  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: fontSizes }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["link"],
        ["clean"],
      ],
      handlers: {
        // Custom handler for applying Word-like styles
        style: function (value) {
          const quill = quillRef.current.getEditor();
          const style = customStyles[value];
          if (style) {
            quill.format("size", style.size);
            quill.format("font", style.font);
            if (style.bold) quill.format("bold", true);
          }
        },
      },
    },
  };

  // Custom toolbar component
  const CustomToolbar = () => (
    <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
      <select className="border rounded px-2 py-1">
        <option>Arial</option>
        <option>Times New Roman</option>
        <option>Calibri</option>
      </select>
      <select className="border rounded px-2 py-1">
        {fontSizes.map((size) => (
          <option key={size}>{size}</option>
        ))}
      </select>
      <div className="flex space-x-1 border-l pl-2">
        <button className="p-1 hover:bg-gray-200 rounded">
          <Bold size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Italic size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Underline size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <Strikethrough size={18} />
        </button>
      </div>
      <div className="flex space-x-1 border-l pl-2">
        <button className="p-1 hover:bg-gray-200 rounded">
          <AlignLeft size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <AlignCenter size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <AlignRight size={18} />
        </button>
      </div>
      <div className="flex space-x-1 border-l pl-2">
        <button className="p-1 hover:bg-gray-200 rounded">
          <List size={18} />
        </button>
        <button className="p-1 hover:bg-gray-200 rounded">
          <ListOrdered size={18} />
        </button>
      </div>
    </div>
  );

  // Add custom styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ql-container {
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      
      .ql-editor {
        padding: 2cm;
        min-height: 29.7cm;
        width: 21cm;
        margin: 0 auto;
        background: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }

      .ql-toolbar {
        border-radius: 4px 4px 0 0;
        background: #f8f9fa;
        border-bottom: 1px solid #e2e8f0;
      }

      .style-btn {
        padding: 4px 8px;
        margin: 0 2px;
        border-radius: 4px;
        cursor: pointer;
      }

      .style-btn:hover {
        background-color: #e2e8f0;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleChange = (content) => {
    setText(content);
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <div className="border rounded-lg shadow-sm bg-white">
      <CustomToolbar />
      <div className="bg-gray-100 p-4">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={text}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          className="bg-white rounded-lg shadow"
        />
      </div>
    </div>
  );
};

export default CustomWordEditor;
