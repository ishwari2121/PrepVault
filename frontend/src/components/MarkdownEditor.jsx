import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiEye, FiCheckCircle } from "react-icons/fi";
import { FaMarkdown } from "react-icons/fa";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MarkdownEditor = () => {
  const [value, setValue] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl bg-slate-800/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header with Gradient Border */}
        <div className="border-b border-slate-700/50 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30" />
          <div className="p-5 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-3 bg-indigo-500/10 rounded-xl"
                whileHover={{ rotate: -10 }}
              >
                <FaMarkdown className="text-2xl text-indigo-400" />
              </motion.div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Markdown Wizard
              </h1>
            </div>
            
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 rounded-lg bg-slate-700/40 hover:bg-slate-600/40 transition-all flex items-center gap-2 text-slate-200"
              >
                {isPreview ? (
                  <>
                    <FiEdit3 className="text-indigo-400" />
                    <span>Edit</span>
                  </>
                ) : (
                  <>
                    <FiEye className="text-purple-400" />
                    <span>Preview</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <div className="p-6 relative">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 opacity-20 bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-indigo-900/30 via-slate-900/30 to-purple-900/30" />

          <AnimatePresence mode="wait">
            {!isPreview ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MDEditor
                  value={value}
                  onChange={setValue}
                  height={400}
                  previewOptions={{
                    className: "prose prose-invert max-w-none bg-transparent"
                  }}
                  className="rounded-xl overflow-hidden border border-slate-700/50 
                    bg-gradient-to-br from-indigo-500/10 via-slate-800/20 to-purple-500/10
                    backdrop-blur-lg shadow-lg"
                  textareaProps={{
                    className: "bg-transparent text-slate-200 placeholder-slate-500/70 font-mono text-sm p-6 focus:ring-2 focus:ring-purple-500/50"
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="prose prose-invert max-w-none p-6 rounded-xl border border-slate-700/50 
                  min-h-[400px] shadow-inner bg-slate-800/30 backdrop-blur-lg"
              >
                <MDEditor.Markdown 
                  source={value} 
                  style={{ background: 'transparent' }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer with Stats */}
          <motion.div 
            className="mt-6 flex justify-between items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-3 text-slate-400 text-sm">
              <div className="flex items-center gap-1 bg-slate-800/40 px-3 py-1 rounded-full">
                <span className="text-indigo-400">{value.split(/\s+/).filter(Boolean).length}</span>
                <span className="text-slate-500">words</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-800/40 px-3 py-1 rounded-full">
                <span className="text-purple-400">{value.length}</span>
                <span className="text-slate-500">chars</span>
              </div>
            </div>

            <motion.button
              onClick={() => {
                setIsSubmitted(true);
                setTimeout(() => setIsSubmitted(false), 2000);
              }}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-medium text-white flex items-center gap-2 
                hover:gap-3 transition-all hover:shadow-lg hover:shadow-indigo-500/20 relative overflow-hidden
                border border-indigo-400/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence>
                {isSubmitted && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    className="absolute inset-0 bg-green-500/10 flex items-center justify-center"
                  >
                    <FiCheckCircle className="text-2xl text-green-400" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className={isSubmitted ? "opacity-0" : "opacity-100"}>
                Publish
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-24 -left-20 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-100" />
        </div>
      </motion.div>
    </div>
  );
};

export default MarkdownEditor;
