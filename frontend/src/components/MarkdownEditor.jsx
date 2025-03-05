import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");

  return (
    <div className="w-full flex flex-col items-center mt-4">
      {/* Editor Wrapper */}
      <div className="w-11/12 max-w-7xl">
        <MDEditor
          value={value}
          onChange={setValue}
          height={600}
          className="border border-gray-300 rounded-lg shadow-md bg-white"
        />

        {/* Submit Button */}
        <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
