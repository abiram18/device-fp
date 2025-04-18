const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "authenticatordevicefp@gmail.com", // Replace with your Gmail
    pass: "bese vged qggk irwz",   // Replace with App password
  },
});

const mailOptions = {
    from: "authenticatordevicefp@gmail.com", // ✅ use the actual email you send from
    to: email,
    subject: "🔐 Login Verification Code",
    html: `<h2>Your login code: <span style="color:blue;">${code}</span></h2>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;