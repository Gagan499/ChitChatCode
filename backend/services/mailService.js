"use strict";

const nodemailer = require("nodemailer");
const welcomeTemplate         = require("../templates/welcomeTemplate");
const resetPasswordTemplate   = require("../templates/resetPasswordTemplate");
const loginAlertTemplate      = require("../templates/loginAlertTemplate");
const passwordChangedTemplate = require("../templates/passwordChangedTemplate");

// ─── Transporter (singleton — reused across all requests) ────────────────────
let transporter = null;

if (process.env.MAIL_HOST && process.env.MAIL_USER && process.env.MAIL_PASS) {
  transporter = nodemailer.createTransport({
    host:   process.env.MAIL_HOST,
    port:   Number(process.env.MAIL_PORT) || 587,
    secure: false,   // STARTTLS on port 587
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
} else {
  console.warn("[MailService] Mail not configured — emails will be skipped");
}

// ─── Core send helper ─────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    console.warn(`[MailService] Skipped "${subject}" to ${to} — mail not configured`);
    return null;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || "ChitChatCode <noreply@chitchatcode.app>",
      to,
      subject,
      html,
    });
    console.log(`[MailService] Sent "${subject}" to ${to} (${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`[MailService] Failed "${subject}" to ${to}:`, error.message);
    return null; // never crash the auth flow
  }
};

// ─── Typed helpers ────────────────────────────────────────────────────────────
const sendWelcomeEmail = ({ to, username }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  return sendEmail({
    to,
    subject: "Welcome to ChitChatCode 🎉",
    html:    welcomeTemplate(username, frontendUrl),
  });
};

const sendPasswordResetEmail = ({ to, username, token }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl    = `${frontendUrl}/reset-password/${token}`;
  return sendEmail({
    to,
    subject: "Reset Your ChitChatCode Password 🔑",
    html:    resetPasswordTemplate(username, resetUrl),
  });
};

const sendLoginAlertEmail = ({ to, username, deviceName, ipAddress, userAgent }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const loginTime   = new Date().toUTCString();
  return sendEmail({
    to,
    subject: "New Login Detected on ChitChatCode 🔔",
    html:    loginAlertTemplate({ username, deviceName, ipAddress, userAgent, loginTime, frontendUrl }),
  });
};

const sendPasswordChangedEmail = ({ to, username }) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const changedAt   = new Date().toUTCString();
  return sendEmail({
    to,
    subject: "Your ChitChatCode Password Was Changed ✅",
    html:    passwordChangedTemplate(username, changedAt, frontendUrl),
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendLoginAlertEmail,
  sendPasswordChangedEmail,
};
