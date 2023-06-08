const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();


// Generate a random verification token
const generateVerificationToken =  () => {
  return crypto.randomBytes(20).toString('hex');
}
const token = generateVerificationToken();

const sendEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GOOGLEKEY
  }
  });

  await transporter.sendMail({
    from: 'amanmandal644@gmail.com',
    to: `${data.email}`,
    subject: 'Email Verification',
    text: `Click the following link to verify your email: https://chat-application-ovk0.onrender.com/api/verify/${token}/${data._id}`,
  })
  .then(()=>console.log('Mail sent successfully'))
  .catch((err)=>console.log("err",err))
}


module.exports = { sendEmail , token}

