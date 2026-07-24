"use client";

import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./RichTextEditorInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-50 rounded-xl border border-orange-300 bg-orange-50/40 animate-pulse" />
  ),
});

export default RichTextEditor;
