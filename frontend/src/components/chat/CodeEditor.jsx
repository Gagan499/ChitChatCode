import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  X,
  Play,
  PaperPlane,
  CaretUp,
  CaretDown,
} from "@phosphor-icons/react";

const CodeEditor = ({ onClose, onSendCode }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef(null);

  const languages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "go",
    "rust",
    "html",
    "css",
    "json",
    "sql",
    "bash",
  ];

  const handleTabKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const runCode = () => {
    if (language === "javascript") {
      try {
        let logs = [];
        const customConsole = {
          log: (...args) => logs.push(args.join(" ")),
          error: (...args) => logs.push("Error: " + args.join(" ")),
          warn: (...args) => logs.push("Warning: " + args.join(" ")),
        };

        const func = new Function("console", code);
        func(customConsole);
        setOutput(logs.join("\n") || "Code executed successfully (no output)");
        setShowPreview(false);
      } catch (error) {
        setOutput("Error: " + error.message);
        setShowPreview(false);
      }
    } else if (language === "html") {
      setShowPreview(true);
      setOutput("");
    }
  };

  const sendCode = () => {
    const snippet = `\`\`\`${language}\n${code}\n\`\`\``;
    onSendCode(snippet);
    onClose();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        backgroundColor: "#1e1e2e",
        color: "#ffffff",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "16px",
        fontFamily: "monospace",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              backgroundColor: "#2a2a3e",
              color: "#ffffff",
              border: "1px solid #555",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "14px",
            }}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <button
            onClick={copyCode}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: "4px",
            }}
            title="Copy code"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={toggleExpanded}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: "4px",
            }}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <CaretUp size={16} /> : <CaretDown size={16} />}
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            padding: "4px",
          }}
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {isExpanded && (
        <>
          <div style={{ position: "relative", marginBottom: "12px" }}>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTabKey}
              placeholder="Write your code here..."
              style={{
                width: "100%",
                minHeight: "200px",
                backgroundColor: "#2a2a3e",
                color: "#ffffff",
                border: "1px solid #555",
                borderRadius: "4px",
                padding: "8px",
                fontFamily: "monospace",
                fontSize: "14px",
                resize: "vertical",
                whiteSpace: "pre",
                overflowWrap: "normal",
                overflowX: "auto",
              }}
            />
          </div>

          {(language === "javascript" || language === "html") && (
            <button
              onClick={runCode}
              style={{
                backgroundColor: "#4CAF50",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
                marginRight: "8px",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Play size={16} />
              Run
            </button>
          )}

          <button
            onClick={sendCode}
            style={{
              backgroundColor: "#2196F3",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <PaperPlane size={16} />
            Send
          </button>

          {output && !showPreview && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px",
                backgroundColor: "#2a2a3e",
                border: "1px solid #555",
                borderRadius: "4px",
                whiteSpace: "pre-wrap",
                fontSize: "14px",
              }}
            >
              <strong>Output:</strong>
              <br />
              {output}
            </div>
          )}

          {showPreview && language === "html" && (
            <div style={{ marginTop: "12px" }}>
              <strong>Preview:</strong>
              <iframe
                srcDoc={code}
                style={{
                  width: "100%",
                  height: "300px",
                  border: "1px solid #555",
                  borderRadius: "4px",
                  backgroundColor: "#ffffff",
                }}
                title="HTML Preview"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CodeEditor;
