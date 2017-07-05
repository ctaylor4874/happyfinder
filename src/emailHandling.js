/**
 * Created by cody on 6/23/17.
 */
import {createTransport} from 'nodemailer';
const mailUser = process.env.EMAIL_ADDRESS;
const mailPass = process.env.EMAIL_PASSWORD;

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: mailUser,
    pass: mailPass,
  }
});

module.exports = {
  getMailOptions: (fromEmail, subject, message, city, state) => {
    return ({
      from: fromEmail,
      to: mailUser,
      subject: '<' + fromEmail + '> at HappyFinder! Subject:  ' + ((city && state) ?
          'New HappyFinder Location Request.' :
          subject
      ),
      text: ((city && state) ?
        'Message: ' + message + '\nCity: ' + city + '\nState: ' + state :
        message),
    })
  },

  transport: (mailOptions, res) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('ERROR' + error);
        res.json(error);
      } else {
        console.log('Email Sent.' + info.response);
        res.json(info.response);
      }
    });
  },
};
