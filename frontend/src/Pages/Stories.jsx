import React from "react";
import MarkdownEditor from "../components/MarkdownEditor";

export default function Stories() {
  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        Markdown Editor
      </h1>
      <MarkdownEditor />
    </div>
  );
}
