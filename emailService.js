const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "authenticatordevicefp@gmail.com", // Replace with your Gmail
    pass: "bese vged qggk irwz",   // Replace with App password
  },
});

const sendVerificationEmail = async (email, code) => {
  const mailOptions = {
    from: "yourgmail@gmail.com",
    to: email,
    subject: "🔐 Login Verification Code",
    html: `<h2>Your login code: <span style="color:blue;">${code}</span></h2>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;