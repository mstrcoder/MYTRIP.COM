const nodemailer = require('nodemailer');


const sendEmail=async options =>{
        // Create A transporter
        // const transporter =nodemailer.createTransport({
        //     service:'Gmail',
        //     auth:{
        //         user:'ifanshakil15@gmail.com',
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
              pass: "d8d5a81bb9111d"
            }
          });
        //   console.log("sending Email!!!!!!!!");
        // Define an Email Options Basically for
        const mailOptions={
            from:'Ifham Shakil <ifan@gmail.com>',
            to:options.email,
            subject:options.subject,
            text:options.message
            // html:options.html
        }

        // console.log("sending Email!!!!!!!!");

        // Actually Send the Email

        const val=await transport.sendMail(mailOptions)
        // console.log(val);
};
module.exports=sendEmail