"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Heading,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  BlockQuote,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

export default function RichTextEditorInner({ value, onChange, placeholder, error = false, minHeight = 200 }) {
  return (
    <div
      className={`rich-text-editor rounded-xl border text-sm ${error ? "border-red-500" : "border-orange-300"}`}
      style={{ "--rte-min-h": `${minHeight}px` }}
    >
      <style>{`
        .rich-text-editor .ck.ck-editor__editable_inline {
          min-height: var(--rte-min-h, 200px);
          padding-left: 1rem;
          padding-right: 1rem;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
        }
        .rich-text-editor .ck.ck-toolbar {
          background: rgba(255, 247, 237, 0.6);
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
      `}</style>
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          licenseKey: "GPL",
          plugins: [Essentials, Paragraph, Heading, Bold, Italic, Underline, Link, List, BlockQuote],
          toolbar: ["heading", "|", "bold", "italic", "underline", "|", "bulletedList", "numberedList", "|", "link", "blockQuote", "|", "undo", "redo"],
          placeholder,
        }}
        onChange={(_, editor) => onChange(editor.getData())}
      />
    </div>
  );
}
