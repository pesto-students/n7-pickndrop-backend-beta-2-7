import nodemailer from 'nodemailer';
export const send=async (email,message)=>{
  const user=process.env.NODEMAILER_USER;
const pass=process.env.NODEMAILER_PASS;
    const transporter = nodemailer.createTransport({
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