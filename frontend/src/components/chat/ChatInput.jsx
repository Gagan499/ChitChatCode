import React, { useState, useRef, useEffect } from "react";
import { Box, Stack, IconButton, InputBase, Chip } from "@mui/material";
import { Paperclip, PaperPlane, Smiley, X } from "@phosphor-icons/react";
import EmojiPicker from "emoji-picker-react";

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  const emojiPickerRef = useRef(null);
  const smileyBtnRef = useRef(null);
  const FILE_INPUT_ID = "chat-file-upload";

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        smileyBtnRef.current &&
        !smileyBtnRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachedFile(file);
    e.target.value = ""; // allow re-selecting same file
  };

  const removeAttachment = () => setAttachedFile(null);

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed && !attachedFile) return;
    if (onSend) onSend({ text: trimmed, file: attachedFile ?? null });
    setMessage("");
    setAttachedFile(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = message.trim().length > 0 || !!attachedFile;

  return (
    <Box sx={{ position: "relative", p: 2, background: "#F8FAFF", borderTop: "1px solid #e8edf5" }}>
      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <Box
          ref={emojiPickerRef}
          sx={{
            position: "absolute",
            bottom: "72px",
            right: "16px",
            zIndex: 1300,
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(91,150,247,0.22)",
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="light"
            height={380}
            width={320}
            searchPlaceholder="Search emoji…"
            lazyLoadEmojis
          />
        </Box>
      )}

      {/* Hidden file input — always in DOM, opened instantly via <label> */}
      <input
        id={FILE_INPUT_ID}
        type="file"
        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Attachment chip preview */}
      {attachedFile && (
        <Box sx={{ mb: 1 }}>
          <Chip
            label={attachedFile.name}
            size="small"
            onDelete={removeAttachment}
            deleteIcon={<X size={12} weight="bold" />}
            sx={{
              background: "#EAF2FE",
              color: "#3b7ef4",
              fontWeight: 600,
              fontSize: "11px",
              maxWidth: "100%",
              "& .MuiChip-deleteIcon": { color: "#3b7ef4" },
            }}
          />
        </Box>
      )}

      <Stack direction="row" spacing={2} alignItems="center">
        {/* Input pill */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flex: 1, background: "#EAF2FE", borderRadius: "12px", px: 1, py: 0.5 }}
        >
          {/*
           * Upload — uses a <label htmlFor> instead of JS .click() so the
           * native file dialog opens synchronously (no perceptible delay).
           */}
          <Box
            component="label"
            htmlFor={FILE_INPUT_ID}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: 32,
              height: 32,
              borderRadius: "8px",
              color: attachedFile ? "#5B96F7" : "#709CE6",
              transition: "color 0.2s, background 0.2s",
              "&:hover": { background: "rgba(91,150,247,0.1)", color: "#5B96F7" },
            }}
          >
            <Paperclip size={20} weight={attachedFile ? "fill" : "regular"} />
          </Box>

          <InputBase
            placeholder="Write a message…"
            fullWidth
            multiline
            maxRows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ fontSize: "14px" }}
          />

          {/* Emoji toggle */}
          <IconButton
            size="small"
            ref={smileyBtnRef}
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            sx={{
              transition: "transform 0.2s",
              transform: showEmojiPicker ? "rotate(20deg) scale(1.15)" : "none",
            }}
          >
            <Smiley
              size={20}
              color={showEmojiPicker ? "#5B96F7" : "#709CE6"}
              weight={showEmojiPicker ? "fill" : "regular"}
            />
          </IconButton>
        </Stack>

        {/* Send */}
        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          sx={{
            background: canSend ? "#5B96F7" : "#c8d9f8",
            borderRadius: "12px",
            padding: "10px",
            color: "white",
            transition: "background 0.2s, transform 0.15s",
            "&:hover": {
              background: canSend ? "#3b7ef4" : "#c8d9f8",
              transform: canSend ? "scale(1.07)" : "none",
            },
          }}
        >
          <PaperPlane size={20} weight="fill" />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default ChatInput;