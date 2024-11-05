import React, { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Circle,
  Square,
  Trash2,
  Indent,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const CustomRichEditor = ({ value, onChange }) => {
  const [text, setText] = useState(value || "");
  const [selection, setSelection] = useState(null);
  const [activeList, setActiveList] = useState(null);

  const cleanHTML = (input) => {
    let content = input;
    content = content.replace(/<\/?[^>]+(xml|w:|o:|v:|m:)[^>]*>/gi, "");
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    content = content.replace(/\s*style="[^"]*"/gi, "");
    content = content.replace(/\s*class="[^"]*"/gi, "");
    content = content.replace(/<\/?span[^>]*>/gi, "");
    content = content.replace(/<div[^>]*>/gi, "");
    content = content.replace(/<\/div>/gi, "<br>");
    content = content.replace(/<!--[\s\S]*?-->/g, "");
    content = content.replace(/<!\[.*?\]>/g, "");
    content = content.replace(/\n\s*\n/g, "\n");
    content = content.replace(/  +/g, " ");
    return content.trim();
  };

  const applyListStyle = (listType) => {
    const editor = document.querySelector('[contenteditable="true"]');
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      let container = range.commonAncestorContainer;

      // Find the closest list container
      while (
        container !== editor &&
        container.nodeName !== "UL" &&
        container.nodeName !== "OL"
      ) {
        container = container.parentNode;
      }

      if (container === editor) {
        // Create new list
        if (listType === "ordered") {
          document.execCommand("insertOrderedList", false, null);
        } else {
          document.execCommand("insertUnorderedList", false, null);
          const list = selection.anchorNode.parentElement.closest("ul");
          if (list) {
            list.className = `list-style-${listType}`;
          }
        }
      } else {
        // Toggle existing list style
        if (container.className === `list-style-${listType}`) {
          document.execCommand("outdent", false, null);
        } else {
          container.className = `list-style-${listType}`;
        }
      }
    }

    setActiveList(listType);
    const newContent = editor.innerHTML;
    setText(newContent);
    onChange && onChange(newContent);
  };

  const handleCommand = (command, param = null) => {
    if (command === "removeFormat") {
      const editableDiv = document.querySelector('[contenteditable="true"]');
      const cleanedContent = cleanHTML(editableDiv.innerHTML);
      editableDiv.innerHTML = cleanedContent;
      setText(cleanedContent);
      onChange && onChange(cleanedContent);
    } else if (command === "list") {
      applyListStyle(param);
    } else {
      document.execCommand(command, false, null);
      const newContent = document.querySelector(
        '[contenteditable="true"]'
      ).innerHTML;
      setText(newContent);
      onChange && onChange(newContent);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    let pastedContent =
      e.clipboardData.getData("text/html") ||
      e.clipboardData.getData("text/plain");
    const cleanedContent = cleanHTML(pastedContent);
    document.execCommand("insertHTML", false, cleanedContent);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      handleCommand("indent");
    }
  };

  // Enhanced format buttons with different list styles
  const formatButtons = [
    { icon: <Bold size={20} />, command: "bold", title: "Bold" },
    { icon: <Italic size={20} />, command: "italic", title: "Italic" },
    {
      icon: <ListOrdered size={20} />,
      command: "list",
      param: "ordered",
      title: "Numbered List",
    },
    {
      icon: <List size={20} />,
      command: "list",
      param: "bullet",
      title: "Bullet List",
    },
    {
      icon: <CheckSquare size={20} />,
      command: "list",
      param: "check",
      title: "Checkbox List",
    },
    {
      icon: <Circle size={20} />,
      command: "list",
      param: "circle",
      title: "Circle List",
    },
    {
      icon: <Square size={20} />,
      command: "list",
      param: "square",
      title: "Square List",
    },
    { icon: <Indent size={20} />, command: "indent", title: "Indent" },
    {
      icon: <AlignLeft size={20} />,
      command: "justifyLeft",
      title: "Align Left",
    },
    {
      icon: <AlignCenter size={20} />,
      command: "justifyCenter",
      title: "Align Center",
    },
    {
      icon: <AlignRight size={20} />,
      command: "justifyRight",
      title: "Align Right",
    },
    {
      icon: <Trash2 size={20} />,
      command: "removeFormat",
      title: "Clear Formatting",
    },
  ];

  useEffect(() => {
    const saveSelection = () => {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        setSelection(sel.getRangeAt(0));
      }
    };

    // Add custom styles for different list types
    const style = document.createElement("style");
    style.textContent = `
      .list-style-bullet li::before { content: '•'; }
      .list-style-check li::before { content: '☐'; }
      .list-style-check li[data-checked="true"]::before { content: '☑'; }
      .list-style-circle li::before { content: '○'; }
      .list-style-square li::before { content: '■'; }
    `;
    document.head.appendChild(style);

    document.addEventListener("selectionchange", saveSelection);
    return () => {
      document.removeEventListener("selectionchange", saveSelection);
      style.remove();
    };
  }, []);

  return (
    <div className="w-full border rounded-lg shadow-sm">
      <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
        {formatButtons.map((button, index) => (
          <button
            key={index}
            onClick={() => handleCommand(button.command, button.param)}
            className={`p-2 hover:bg-gray-200 rounded-lg transition-colors ${
              activeList === button.param ? "bg-gray-200" : ""
            }`}
            title={button.title}
          >
            {button.icon}
          </button>
        ))}
      </div>

      <div
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose max-w-none"
        dangerouslySetInnerHTML={{ __html: text }}
        onInput={(e) => {
          setText(e.currentTarget.innerHTML);
          onChange && onChange(e.currentTarget.innerHTML);
        }}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default CustomRichEditor;
