import nodemailer from 'nodemailer';
const user="pickdrop813@gmail.com";
const pass="Test@123";
export const send=async (email,message)=>{
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass
        }
      });
      await transporter.sendMail({
        from: user,
        to: email,
        subject: 'Welcome to PicknDrop',
        text: message
      })
}