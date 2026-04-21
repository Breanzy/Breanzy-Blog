"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

interface TiptapEditorProps {
    value?: string;
    onChange?: (html: string) => void;
    placeholder?: string;
}

const ToolbarButton = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button
        type="button"
        title={title}
        onClick={onClick}
        className={`px-2 py-1 rounded text-sm transition-colors ${active ? "bg-blue-600 text-white" : "text-neutral-300 hover:bg-neutral-700"}`}
    >
        {children}
    </button>
);

export default function TiptapEditor({ value, onChange, placeholder = "Write something..." }: TiptapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder }),
            Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-blue-400 underline" } }),
        ],
        content: value || "",
        editorProps: {
            attributes: { class: "tiptap-editor min-h-[300px] outline-none px-4 py-3 text-neutral-200 leading-relaxed" },
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        },
    });

    // Sync external value changes (e.g. when editing an existing post)
    useEffect(() => {
        if (!editor || value === undefined) return;
        if (editor.getHTML() !== value) {
            editor.commands.setContent(value, false);
        }
    }, [value, editor]);

    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt("URL");
        if (!url) return;
        editor.chain().focus().setLink({ href: url }).run();
    };

    return (
        <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900 focus-within:border-blue-600 transition-colors">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-0.5 p-2 border-b border-neutral-800 bg-neutral-950">
                <ToolbarButton title="Bold (Ctrl+B)" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}><b>B</b></ToolbarButton>
                <ToolbarButton title="Italic (Ctrl+I)" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}><i>I</i></ToolbarButton>
                <ToolbarButton title="Strikethrough" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")}><s>S</s></ToolbarButton>
                <ToolbarButton title="Inline code" onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")}>{"<>"}</ToolbarButton>
                <span className="w-px bg-neutral-700 mx-1" />
                <ToolbarButton title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })}>H1</ToolbarButton>
                <ToolbarButton title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })}>H2</ToolbarButton>
                <ToolbarButton title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })}>H3</ToolbarButton>
                <span className="w-px bg-neutral-700 mx-1" />
                <ToolbarButton title="Bullet list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>• List</ToolbarButton>
                <ToolbarButton title="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>1. List</ToolbarButton>
                <ToolbarButton title="Blockquote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>"</ToolbarButton>
                <ToolbarButton title="Code block" onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")}>{"{ }"}</ToolbarButton>
                <span className="w-px bg-neutral-700 mx-1" />
                <ToolbarButton title="Link" onClick={setLink} active={editor.isActive("link")}>Link</ToolbarButton>
                <ToolbarButton title="Remove link" onClick={() => editor.chain().focus().unsetLink().run()}>Unlink</ToolbarButton>
                <span className="w-px bg-neutral-700 mx-1" />
                <ToolbarButton title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↩</ToolbarButton>
                <ToolbarButton title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↪</ToolbarButton>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
