import nodemailer from "nodemailer"
import { config } from "dotenv";


config()
export const sendMailFunction = (mail_options) =>{
    try {
        const trnasporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.REPORTS_EMAIL,
                pass: process.env.REPORTS_EMAIL_PASS
            }
          });
          trnasporter.sendMail(mail_options, function(error,info){
            if(error){
                console.log(error)
            } else{
                console.log(info.response)
            }
          })
    } catch (error) {
        console.log(`Error sending message ${error}`)
    }
}
