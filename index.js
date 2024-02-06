const { createClient } = require('redis');
const nodemailer = require('nodemailer');


(async () => {


  const subscriber = createClient({
    url: process.env.redis_url
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