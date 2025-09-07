// THROWAWAY SPIKE — task 2.1. Not part of the app. Delete before merging
// anything, or keep only on the spike-toastui-2.1 branch.
//
// Uses @toast-ui/editor directly (NOT @toast-ui/react-editor) because the
// React wrapper's peer dependency is pinned to react@^17.0.1 and hasn't
// been published since 2023-02-17 — installing it under React 18 throws
// ERESOLVE. The core @toast-ui/editor package has zero peer deps (it's
// vanilla JS), so we drive it ourselves with useRef/useEffect — this is
// the standard integration pattern for Toast UI + React 18/19 projects.
import { useEffect, useRef, useState } from "react";
import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

const SAMPLE_MARKDOWN = `# Paso 3: Configurar la fórmula BUSCARV

Selecciona la celda **B2** y escribe la siguiente fórmula:

\`\`\`
=BUSCARV(A2, Hoja2!A:C, 3, FALSO)
\`\`\`

- El primer argumento es el valor a buscar.
- El segundo es el rango donde buscar.

> Nota: si el resultado es #N/A, revisa que la columna A no tenga espacios extra.
`;

export default function ToastSpike() {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [log, setLog] = useState([]);

  const addLog = (msg) => setLog((l) => [...l, msg]);

  useEffect(() => {
    instanceRef.current = new Editor({
      el: editorRef.current,
      height: "500px",
      initialEditType: "markdown",
      previewStyle: "vertical",
      initialValue: SAMPLE_MARKDOWN,
      theme: dark ? "dark" : "light",
      hooks: {
        addImageBlobHook: (blob, callback) => {
          // Spike stub: real Phase 2.4 wiring routes this through
          // useImageUpload.js -> Firebase. Here we just fake a URL so we
          // can test insertion + continued typing without touching Firebase.
          const fakeUrl = URL.createObjectURL(blob);
          callback(fakeUrl, blob.name || "pasted-image");
          addLog(`addImageBlobHook fired: ${blob.name || "(blob)"}`);
        },
      },
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Toast UI's theme is set at construction time only (no live setTheme
    // API on the instance) — Phase 2.4 will need to fully re-mount the
    // editor on theme toggle, same as it re-mounts on initial dark-mode
    // read. Documenting that here since it's non-obvious.
    if (!instanceRef.current) return;
  }, [dark]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Toast UI Editor spike (2.1)</h1>
      <p className="mb-4 text-sm text-gray-500">
        Checklist: paste a real Markdown draft — insert an image mid-paragraph
        and keep typing right after it, in both markdown and WYSIWYG modes —
        toggle dark mode.
      </p>

      <div className="mb-4 flex gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-800 text-white text-sm"
          onClick={() => setDark((d) => !d)}
        >
          Toggle dark flag (see console note): {dark ? "dark" : "light"}
        </button>
      </div>

      <div ref={editorRef} />

      <div className="mt-4 text-xs font-mono bg-gray-100 p-2 rounded">
        <div className="font-bold mb-1">Event log:</div>
        {log.length === 0 ? <div>(nothing yet)</div> : null}
        {log.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
    </div>
  );
}
