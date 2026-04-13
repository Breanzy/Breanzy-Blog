"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import ReactQuill with SSR disabled — Quill accesses `document` on load
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function QuillEditor(props: any) {
    return <ReactQuill {...props} />;
}
