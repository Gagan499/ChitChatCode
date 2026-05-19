/**
 * Welcome email template — sent after successful registration.
 * @param {string} username
 * @param {string} frontendUrl
 * @returns {string} HTML string
 */
const welcomeTemplate = (username, frontendUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to ChitChatCode</title>
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

          <!-- Main Card -->
          <tr>
            <td>
              <div style="background:linear-gradient(135deg,rgba(42,10,94,0.8),rgba(138,28,124,0.4));border:1px solid rgba(168,85,247,0.2);border-radius:24px;padding:48px 40px;backdrop-filter:blur(20px);">

                <!-- Emoji + Headline -->
                <p style="font-size:48px;text-align:center;margin:0 0 16px;">🎉</p>
                <h1 style="color:#ffffff;font-size:28px;font-weight:800;text-align:center;margin:0 0 12px;letter-spacing:-0.5px;">
                  Welcome, ${username}!
                </h1>
                <p style="color:#c4b5fd;font-size:16px;text-align:center;margin:0 0 40px;line-height:1.6;">
                  You're officially part of the ChitChatCode community — where developers collaborate, communicate, and code together in real time.
                </p>

                <!-- Feature pills -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                  <tr>
                    <td style="padding:0 6px 12px;">
                      <div style="background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:12px;padding:16px;text-align:center;">
                        <p style="color:#a855f7;font-size:20px;margin:0 0 6px;">💬</p>
                        <p style="color:#e9d5ff;font-size:13px;font-weight:600;margin:0;">Real-time Chat</p>
                      </div>
                    </td>
                    <td style="padding:0 6px 12px;">
                      <div style="background:rgba(17,160,157,0.15);border:1px solid rgba(17,160,157,0.3);border-radius:12px;padding:16px;text-align:center;">
                        <p style="color:#11a09d;font-size:20px;margin:0 0 6px;">👨‍💻</p>
                        <p style="color:#ccfbf1;font-size:13px;font-weight:600;margin:0;">Code Together</p>
                      </div>
                    </td>
                    <td style="padding:0 6px 12px;">
                      <div style="background:rgba(42,10,94,0.5);border:1px solid rgba(168,85,247,0.2);border-radius:12px;padding:16px;text-align:center;">
                        <p style="color:#818cf8;font-size:20px;margin:0 0 6px;">🔒</p>
                        <p style="color:#c7d2fe;font-size:13px;font-weight:600;margin:0;">Secure & Private</p>
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- CTA Button -->
                <p style="text-align:center;margin:0;">
                  <a href="${frontendUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#8a1c7c);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;box-shadow:0 8px 24px rgba(124,58,237,0.4);">
                    Open ChitChatCode →
                  </a>
                </p>

              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:#4b5563;font-size:13px;margin:0 0 8px;">
                You're receiving this because you created a ChitChatCode account.
              </p>
              <p style="color:#374151;font-size:13px;margin:0;">
                © ${new Date().getFullYear()} ChitChatCode. Built for developers.
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

module.exports = welcomeTemplate;
