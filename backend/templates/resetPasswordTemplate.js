/**
 * Reset-password email template.
 * @param {string} username
 * @param {string} resetUrl  - Full URL including token
 * @returns {string} HTML string
 */
const resetPasswordTemplate = (username, resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password — ChitChatCode</title>
</head>
<body style="margin:0;padding:0;background:#0f0a1e;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0a1e;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <div style="background:linear-gradient(135deg,#2a0a5e,#8a1c7c,#11a09d);border-radius:20px;padding:2px;display:inline-block;">
                <div style="background:#0f0a1e;border-radius:18px;padding:20px 36px;">
                  <span style="font-size:26px;font-weight:800;background:linear-gradient(135deg,#a855f7,#11a09d);-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-0.5px;">
                    ChitChatCode
                  </span>
                </div>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td>
              <div style="background:linear-gradient(135deg,rgba(42,10,94,0.8),rgba(138,28,124,0.4));border:1px solid rgba(168,85,247,0.2);border-radius:24px;padding:48px 40px;">

                <p style="font-size:44px;text-align:center;margin:0 0 16px;">🔑</p>
                <h1 style="color:#ffffff;font-size:26px;font-weight:800;text-align:center;margin:0 0 12px;">
                  Password Reset Request
                </h1>
                <p style="color:#c4b5fd;font-size:15px;text-align:center;margin:0 0 12px;line-height:1.6;">
                  Hey <strong style="color:#e9d5ff;">${username}</strong>, we received a request to reset the password for your ChitChatCode account.
                </p>
                <p style="color:#c4b5fd;font-size:15px;text-align:center;margin:0 0 36px;line-height:1.6;">
                  Click the button below — this link expires in <strong style="color:#f59e0b;">15 minutes</strong>.
                </p>

                <!-- CTA -->
                <p style="text-align:center;margin:0 0 36px;">
                  <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#8a1c7c);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;box-shadow:0 8px 24px rgba(124,58,237,0.4);">
                    Reset My Password →
                  </a>
                </p>

                <!-- Security notice -->
                <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:14px;padding:20px 24px;">
                  <p style="color:#fcd34d;font-size:13px;font-weight:700;margin:0 0 6px;">⚠️ Security Notice</p>
                  <p style="color:#fef3c7;font-size:13px;margin:0;line-height:1.6;">
                    If you did not request a password reset, please ignore this email — your account is safe. Do not share this link with anyone.
                  </p>
                </div>

              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:#4b5563;font-size:13px;margin:0 0 8px;">
                This link will expire in 15 minutes for your security.
              </p>
              <p style="color:#374151;font-size:13px;margin:0;">
                © ${new Date().getFullYear()} ChitChatCode. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

module.exports = resetPasswordTemplate;
