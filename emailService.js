const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com", // Your newly created Gmail
    pass: "your-app-password",   // App password from step 3
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "🔐 Login Verification Code",
    html: `<h2>Your code: <span style="color:blue;">${code}</span></h2>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;