const nodemailer = require("nodemailer");
const pug = require('pug');
const htmlToText=require('html-to-text')
// new email(user,url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email), (this.firstName = user.name.split(" ")[0]);
    this.url = url;
    this.from = "Md Ifham Shakil <ifan@gmail.com>";
  }
  newTransport() {
    // if()
    return nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 25,
      auth: {
        user: "707f225376a948",
        pass: "d8d5a81bb9111d",
      },
    });
  }
  async send(template, subject) {
    // eRender then HTML PUG template
    console.log(template,subject);
   const html= pug.renderFile(`${__dirname}/../views/email/${template}.pug`,{
     firstName:this.firstName,
     url:this.url,
     subject
   })
    //define Email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
      // html:options.html 
    };


    //Create A transport and Send Email
     await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send("welcome", "Welcome to the MYTRIP Family");
  }
  async sendPasswordReset() {
    await this.send("passwordReset", "Your Password reset Token is Valide for 10 Min");
  }
};
// const sendEmail = async (options) => {
//   // Create A transporter
//   // const transporter =nodemailer.createTransport({
//   //     service:'Gmail',
//   //     auth:{
//   //         user:'ifans hakil15@gmail.com',
//   //         password:'ifanshakil'

//   //     }

//   //     //activate in Gmail 'less secure app ' option
//   // })
//   // console.log("sending Email!!!!!!!!");
//   const transport = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 25,
//     auth: {
//       user: "707f225376a948",
//       pass: "d8d5a81bb9111d",
//     },
//   });
//   //   console.log("sending Email!!!!!!!!");
//   // Define an Email Options Basically for
//   const mailOptions = {
//     from: "Ifham Shakil <ifan@gmail.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     // html:options.html
//   };

//   // console.log("sending Email!!!!!!!!");

//   // Actually Send the Email


//   // console.log(val);
// };
// module.exports = sendEmail;
