const bcrypt=require('bcryptjs');
const nodemailer=require('nodemailer')
const {config}=require('../config/config')


module.exports.hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Invalid password input for hashing.");
  }
  return await bcrypt.hash(password, 10);
};

module.exports.comparePassword= async(inputPassword,savedPassword)=>{
    if (!inputPassword || typeof inputPassword !== "string") {
    throw new Error("Invalid password input for hashing.");
  }
  return await bcrypt.compare(inputPassword,savedPassword);
}

module.exports.generateOtpandexpirationTime = () =>{
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
  return {otp, expirationTime}
}


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
      user: config.PROVIDER_MAIL,
      pass: config.PROVIDER_PASS
  }
});

module.exports.sendEmail = async function (to, subject, html) {
  console.log("email:", to);
  try {
    const info = await transporter.sendMail({
      from: '"Matchify" <rohithsharmaa105@gmail.com>',
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};