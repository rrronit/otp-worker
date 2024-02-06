const { createClient } = require('redis');
const nodemailer = require('nodemailer');
require('dotenv').config();


(async () => {

console.log(process.env)
  const subscriber =  createClient({
    url: "redis://default:14b28c57a874402195147e14c67b18cf@us1-leading-mammoth-41204.upstash.io:41204"
  });

  await subscriber.connect();

  await subscriber.subscribe('send', (message) => {
    console.log(message)
    const { email, otp } = JSON.parse(message)
    sendMessage(email, otp)

  });


})();


const sendMessage = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }
  });
  const mailOptions = {
    from: process.env.email,
    to: email,
    subject: 'Your OTP for Verification',
    text: `Your OTP is: ${otp}`,
  };
  await transporter.sendMail(mailOptions)

}