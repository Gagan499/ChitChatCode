import React, { useState } from "react";
import { Box, Stack, Typography, IconButton, Tooltip } from "@mui/material";
import { DownloadSimple, File, Play, CopySimple, Check } from "@phosphor-icons/react";

// ─── Utility: parse message into text + code-block segments ─────────────────
function parseMessage(text) {
  const segments = [];
  // Match ```lang\ncode``` or ```code```
  const codeRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({ kind: "code", lang: match[1] || "js", content: match[2].trim() });
    lastIndex = codeRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", content: text.slice(lastIndex) });
  }

  return segments;
}

// ─── Code Block with Run Button ──────────────────────────────────────────────
const CodeBlock = ({ lang, code, isSender }) => {
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setRunning(true);
    setOutput(null);

    try {
      // Sandboxed execution via Function constructor — captures console.log output
      const logs = [];
      const sandboxConsole = {
        log: (...args) => logs.push(args.map(String).join(" ")),
        error: (...args) => logs.push("❌ " + args.map(String).join(" ")),
        warn: (...args) => logs.push("⚠️ " + args.map(String).join(" ")),
      };

      // eslint-disable-next-line no-new-func
      const fn = new Function("console", code);
      let returnVal;
      try {
        returnVal = fn(sandboxConsole);
      } catch (err) {
        logs.push("❌ Runtime error: " + err.message);
      }

      if (returnVal !== undefined) logs.push("→ " + String(returnVal));
      setOutput(logs.length > 0 ? logs.join("\n") : "(no output)");
    } catch (err) {
      setOutput("❌ Syntax error: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isRunnable = ["js", "javascript", "ts", "typescript", ""].includes(lang.toLowerCase());

  return (
    <Box
      sx={{
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.12)",
        my: 0.5,
        background: "#1e1e2e",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
      }}
    >
      {/* Code block header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.5,
          py: 0.6,
          background: "#13131f",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <Typography
          sx={{
            color: "#6e8cff",
            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {lang || "code"}
        </Typography>

        <Stack direction="row" spacing={0.5}>
          {/* Copy Button */}
          <Tooltip title={copied ? "Copied!" : "Copy code"}>
            <IconButton size="small" onClick={handleCopy} sx={{ color: copied ? "#4ade80" : "#a0aec0", p: "4px" }}>
              {copied ? <Check size={14} weight="bold" /> : <CopySimple size={14} />}
            </IconButton>
          </Tooltip>

          {/* Run Button — only for JS/TS */}
          {isRunnable && (
            <Tooltip title="Run code">
              <IconButton
                size="small"
                onClick={handleRun}
                disabled={running}
                sx={{
                  background: "linear-gradient(135deg, #5B96F7 0%, #7c3aed 100%)",
                  color: "#fff",
                  borderRadius: "6px",
                  px: 1,
                  py: "3px",
                  fontSize: "11px",
                  fontWeight: 700,
                  gap: "3px",
                  "&:hover": { opacity: 0.88 },
                  "&.Mui-disabled": { opacity: 0.4, color: "#fff" },
                }}
              >
                <Play size={12} weight="fill" />
                <span style={{ fontSize: "11px", fontFamily: "sans-serif" }}>Run</span>
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Stack>

      {/* Code content */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: "12px 16px",
          overflowX: "auto",
          fontFamily: "'Fira Code', 'Cascadia Code', 'Courier New', monospace",
          fontSize: "12.5px",
          lineHeight: 1.7,
          color: "#e2e8f0",
          whiteSpace: "pre",
        }}
      >
        {code}
      </Box>

      {/* Output Panel */}
      {output !== null && (
        <Box
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "#0d0d1a",
            px: 2,
            py: 1.5,
          }}
        >
          <Typography sx={{ color: "#94a3b8", fontSize: "10px", mb: 0.5, fontFamily: "monospace", letterSpacing: "0.08em" }}>
            OUTPUT
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              fontFamily: "'Fira Code', monospace",
              fontSize: "12px",
              color: "#4ade80",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {output}
          </Box>
        </Box>
      )}
    </Box>
  );
};

// ─── Main MessageBubble ───────────────────────────────────────────────────────
const MessageBubble = ({ message, isSender, type, fileData, time }) => {
  const segments = message ? parseMessage(message) : [];
  const hasCode = segments.some((s) => s.kind === "code");

  return (
    <Stack direction="row" justifyContent={isSender ? "end" : "start"} className="mb-4">
      <Box
        sx={{
          maxWidth: hasCode ? "85%" : "70%",
          p: "12px 14px",
          borderRadius: "16px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          background: isSender ? "#5B96F7" : "#ffffff",
          color: isSender ? "#fff" : "#1a202c",
          borderTopRightRadius: isSender ? "4px" : "16px",
          borderTopLeftRadius: isSender ? "16px" : "4px",
          border: isSender ? "none" : "1px solid #e8edf5",
        }}
      >
        <Stack spacing={0.75}>
          {/* Image Message */}
          {type === "image" && fileData?.url && (
            <Box className="rounded-lg overflow-hidden border border-white/20">
              <img src={fileData.url} alt="attachment" className="w-full max-h-60 object-cover" />
            </Box>
          )}

          {/* File Message */}
          {type === "file" && fileData?.name && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ background: "rgba(255,255,255,0.1)", p: 1, borderRadius: "10px", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              <Box sx={{ background: "#eff6ff", p: 1, borderRadius: "8px", color: "#3b82f6" }}>
                <File size={24} weight="fill" />
              </Box>
              <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }} noWrap>
                {fileData.name}
              </Typography>
              <IconButton size="small" sx={{ color: "inherit" }}>
                <DownloadSimple size={20} />
              </IconButton>
            </Stack>
          )}

          {/* Text + Code Segments */}
          {segments.map((seg, i) =>
            seg.kind === "code" ? (
              <CodeBlock key={i} lang={seg.lang} code={seg.content} isSender={isSender} />
            ) : (
              seg.content.trim() && (
                <Typography
                  key={i}
                  variant="body2"
                  sx={{ lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {seg.content}
                </Typography>
              )
            )
          )}

          {/* Timestamp */}
          <Typography
            variant="caption"
            sx={{
              fontSize: "10px",
              alignSelf: "flex-end",
              color: isSender ? "rgba(255,255,255,0.65)" : "#94a3b8",
            }}
          >
            {time}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MessageBubble;