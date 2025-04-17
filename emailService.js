const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "authenticatordevicefp@gmail.com", // Replace with your Gmail
    pass: "bese vged qggk irwz",   // Replace with your app password
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "🔐 Login Verification Code",
    html: `<h2>Your verification code is: <span style="color:blue;">${code}</span></h2>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification code sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    throw err;
  }
};

module.exports = sendVerificationEmail;
