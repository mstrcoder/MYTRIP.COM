const nodemailer = require("nodemailer");
// new email(user,url).sendWelcome()
module.exports = class Email {
  constructor(user, url) {
    (this.to = user.email), (this.firstName = user.name.split(" ")[0]);
    this.url = url;
    this.from = "Md Ifham Shakil <ifan@gmail.com>";
  }
  createTransport() {
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
  send(template, subject) {
    // eRender then HTML PUG template
    res.render('')
    //define Email options
    const mailOptions = {
      from: "Ifham Shakil <ifan@gmail.com>",
      to: options.email,
      subject: options.subject,
      text: options.message,
      // html:options.html
    };


    //Create A transport and Send Email
  }
  sendWelcome() {
    this.send("Welcome!", "Welcome to the MYTRIP Family");
  }
};
const sendEmail = async (options) => {
  // Create A transporter
  // const transporter =nodemailer.createTransport({
  //     service:'Gmail',
  //     auth:{
  //         user:'ifans hakil15@gmail.com',
  //         password:'ifanshakil'

  //     }

  //     //activate in Gmail 'less secure app ' option
  // })
  // console.log("sending Email!!!!!!!!");
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 25,
    auth: {
      user: "707f225376a948",
      pass: "d8d5a81bb9111d",
    },
  });
  //   console.log("sending Email!!!!!!!!");
  // Define an Email Options Basically for
  const mailOptions = {
    from: "Ifham Shakil <ifan@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:options.html
  };

  // console.log("sending Email!!!!!!!!");

  // Actually Send the Email

  const val = await transport.sendMail(mailOptions);
  // console.log(val);
};
module.exports = sendEmail;
