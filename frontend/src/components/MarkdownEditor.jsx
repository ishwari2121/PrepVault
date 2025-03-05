import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");

  return (
    <div className="editor-container">
      {/* Markdown Editor Wrapper */}
      <div className="editor-wrapper">
        <MDEditor value={value} onChange={setValue} height={300} />

        {/* Submit Button */}
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
