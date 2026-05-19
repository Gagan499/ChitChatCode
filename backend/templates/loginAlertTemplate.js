/**
 * Login alert email template — sent on new device login.
 * @param {object} params
 * @param {string} params.username
 * @param {string} params.deviceName
 * @param {string} params.ipAddress
 * @param {string} params.userAgent
 * @param {string} params.loginTime
 * @param {string} params.frontendUrl
 * @returns {string} HTML string
 */
const loginAlertTemplate = ({ username, deviceName, ipAddress, userAgent, loginTime, frontendUrl }) => {
  // Extract browser/OS from UA string for a friendlier display
  const getBrowserName = (ua = "") => {
    if (/edg/i.test(ua))    return "Microsoft Edge";
    if (/chrome/i.test(ua)) return "Google Chrome";
    if (/firefox/i.test(ua)) return "Mozilla Firefox";
    if (/safari/i.test(ua)) return "Apple Safari";
    if (/opera/i.test(ua))  return "Opera";
    return "Unknown Browser";
  };

  const getOS = (ua = "") => {
    if (/windows nt 10/i.test(ua)) return "Windows 10/11";
    if (/windows/i.test(ua))       return "Windows";
    if (/mac os x/i.test(ua))      return "macOS";
    if (/android/i.test(ua))       return "Android";
    if (/iphone|ipad/i.test(ua))   return "iOS";
    if (/linux/i.test(ua))         return "Linux";
    return "Unknown OS";
  };

  const browser = getBrowserName(userAgent);
  const os      = getOS(userAgent);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Login Detected — ChitChatCode</title>
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

                <p style="font-size:44px;text-align:center;margin:0 0 16px;">🔔</p>
                <h1 style="color:#ffffff;font-size:26px;font-weight:800;text-align:center;margin:0 0 12px;">
                  New Login Detected
                </h1>
                <p style="color:#c4b5fd;font-size:15px;text-align:center;margin:0 0 36px;line-height:1.6;">
                  Hey <strong style="color:#e9d5ff;">${username}</strong>, a new sign-in to your ChitChatCode account was just recorded.
                </p>

                <!-- Details table -->
                <div style="background:rgba(15,10,30,0.6);border:1px solid rgba(168,85,247,0.15);border-radius:16px;padding:24px;margin-bottom:32px;">
                  ${[
                    ["🖥️ Device",  deviceName],
                    ["🌐 Browser", browser],
                    ["💻 OS",      os],
                    ["📍 IP Address", ipAddress],
                    ["🕐 Time",    loginTime],
                  ].map(([label, value]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                    <tr>
                      <td style="color:#9ca3af;font-size:13px;font-weight:600;width:140px;vertical-align:top;padding-top:2px;">${label}</td>
                      <td style="color:#e9d5ff;font-size:14px;font-weight:500;">${value}</td>
                    </tr>
                  </table>`).join("")}
                </div>

                <!-- Security notice -->
                <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:14px;padding:20px 24px;margin-bottom:32px;">
                  <p style="color:#fca5a5;font-size:13px;font-weight:700;margin:0 0 6px;">🚨 Wasn't you?</p>
                  <p style="color:#fee2e2;font-size:13px;margin:0;line-height:1.6;">
                    If you didn't sign in just now, your account may be compromised. Reset your password immediately using the button below.
                  </p>
                </div>

                <!-- CTA -->
                <p style="text-align:center;margin:0;">
                  <a href="${frontendUrl}/forgot-password" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#991b1b);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;box-shadow:0 8px 24px rgba(220,38,38,0.3);">
                    Secure My Account →
                  </a>
                </p>

              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:32px;">
              <p style="color:#4b5563;font-size:13px;margin:0 0 8px;">
                This alert was sent because a login was recorded on your account.
              </p>
              <p style="color:#374151;font-size:13px;margin:0;">
                © ${new Date().getFullYear()} ChitChatCode. Stay secure.
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
};

module.exports = loginAlertTemplate;
