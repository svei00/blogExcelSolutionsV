import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Editor from "@toast-ui/editor";
// Toast UI's CSS is imported from index.css, not here — see the comment
// there for why bundle order matters (Tailwind/toolbar-icon conflict).
import useImageUpload from "../hooks/useImageUpload";

// Toast UI wrapper, markdown in/out, nothing else (REBUILD_PLAN 2.4).
// `@toast-ui/editor` core is used directly, not `@toast-ui/react-editor`
// (dead package, ERESOLVEs against React 18 — see 2.1 spike findings).
export default function PostEditor({ value, onChange, placeholder }) {
  const { theme } = useSelector((state) => state.theme);
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const { uploadImage } = useImageUpload();

  // Toast UI's `theme` option is constructor-only (no live setTheme() —
  // 2.1 finding), so a dark-mode flip destroys and reconstructs the editor.
  useEffect(() => {
    const editor = new Editor({
      el: containerRef.current,
      height: "400px",
      initialEditType: "wysiwyg",
      previewStyle: "vertical",
      theme: theme === "dark" ? "dark" : "light",
      placeholder,
      initialValue: value || "",
      hooks: {
        addImageBlobHook: async (blob, callback) => {
          const downloadURL = await uploadImage(blob);
          callback(downloadURL, blob.name);
        },
      },
      events: {
        change: () => {
          onChange(editorRef.current.getMarkdown());
        },
      },
    });

    editorRef.current = editor;

    return () => {
      editor.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  return <div ref={containerRef} />;
}
