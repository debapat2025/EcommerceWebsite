// Escape user-provided text so it cannot inject HTML into the email
const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Shared layout used by every email
const layout = ({ heading, intro, buttonText, url, footer }) => `
<div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #222;">
  <h2 style="color: #1F4E79; margin-top: 0;">${heading}</h2>
  <p style="line-height: 1.5;">${intro}</p>
  <p style="margin: 28px 0;">
    <a href="${escapeHtml(url)}"
       style="background: #1F4E79; color: #ffffff; padding: 12px 22px; text-decoration: none; border-radius: 4px; display: inline-block;">
      ${buttonText}
    </a>
  </p>
  <p style="font-size: 13px; color: #666; line-height: 1.5;">
    If the button does not work, copy this link into your browser:<br>
    <span style="word-break: break-all;">${escapeHtml(url)}</span>
  </p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
  <p style="font-size: 12px; color: #888;">${footer}</p>
</div>`;

const verifyEmail = ({ name, url }) => ({
  subject: 'Verify your email address',
  text:
    `Hi ${name},\n\n` +
    `Please verify your email address by opening this link (valid for 24 hours):\n${url}\n\n` +
    `If you did not create an account, you can ignore this email.`,
  html: layout({
    heading: 'Verify your email',
    intro: `Hi ${escapeHtml(name)}, thanks for signing up. Please confirm your email address. This link is valid for 24 hours.`,
    buttonText: 'Verify email',
    url,
    footer: 'If you did not create an account, you can safely ignore this email.',
  }),
});

const resetPassword = ({ name, url }) => ({
  subject: 'Reset your password',
  text:
    `Hi ${name},\n\n` +
    `We received a request to reset your password. Open this link (valid for 15 minutes):\n${url}\n\n` +
    `If you did not request this, you can ignore this email. Your password will not change.`,
  html: layout({
    heading: 'Reset your password',
    intro: `Hi ${escapeHtml(name)}, we received a request to reset your password. This link is valid for 15 minutes.`,
    buttonText: 'Reset password',
    url,
    footer: 'If you did not request this, you can safely ignore this email. Your password will not change.',
  }),
});

module.exports = { verifyEmail, resetPassword };