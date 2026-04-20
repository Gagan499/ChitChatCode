import React, { useState, useRef, useEffect } from "react";
import {
  Copy,
  X,
  Play,
  PaperPlane,
  CaretUp,
  CaretDown,
  CircleNotch,
} from "@phosphor-icons/react";
import { executeCode } from "../../services/codeService";

const CodeEditor = ({ onClose, onSendCode }) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
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

  const runCode = async () => {
    // HTML gets instant local preview — no server round-trip needed
    if (language === "html") {
      setShowPreview(true);
      setOutput("");
      return;
    }

    setIsRunning(true);
    setOutput("");
    setShowPreview(false);

    try {
      const result = await executeCode(language, code);

      if (result.success) {
        setOutput(result.output || "Code executed successfully (no output)");
      } else {
        setOutput(result.error || result.output || "Execution failed.");
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    } finally {
      setIsRunning(false);
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

          <button
            onClick={runCode}
            disabled={isRunning || !code.trim()}
            style={{
              backgroundColor: isRunning ? "#666" : "#4CAF50",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: isRunning ? "not-allowed" : "pointer",
              marginRight: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              opacity: !code.trim() ? 0.5 : 1,
            }}
          >
            {isRunning ? (
              <CircleNotch size={16} className="spin" />
            ) : (
              <Play size={16} />
            )}
            {isRunning ? "Running…" : "Run"}
          </button>

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

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default CodeEditor;
