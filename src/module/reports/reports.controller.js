import { config } from "dotenv";
import { sendMailFunction } from "../../utils/report-mail.settings.js";
config();

export const sendReport = (req, res, next) => {
  try {
    const currentDate = new Date().toISOString().split("T")[0];
    const { name, email, text } = req.body;
    const mail_options = {
      from: process.env.REPORTS_EMAIL,
      to: "diloromturdiyeva90@gmail.com", 
      subject: "Yangi bildirishnoma! Real Estate",
      html: `
              <h3><b>Name:</b> ${name}</h3>
              <h3><b>Email:</b> ${email}</h3>
              <h3><b>User Message:</b> ${text}</h3>
              <h3><b>Date:</b> ${currentDate}</h3>
              `,
    };
    sendMailFunction(mail_options);
    res.redirect("http://127.0.0.1:8080/api/homes");
  } catch (error) {
    next(error);
  }
};
