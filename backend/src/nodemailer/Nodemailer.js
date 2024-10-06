const nodemailer = require('nodemailer');

// Create a transporter for sending emails via Gmail
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sohamvirani4865@gmail.com',
    pass: 'hidl ljrk spmw nhkj',
  },
});

// Function to send confirmation email for event registration
const sendConfirmationEmail = async (recipient, eventDetails) => {
  try {
    const message = {
      from: 'sohamvirani4865@gmail.com', // Sender's email address
      to: recipient, // Recipient's email address
      subject: 'Your Registration is Confirmed - EventCrew', // Subject of the email
      text: `
      Hi there!

      We're excited to let you know that your registration for our upcoming event has been successfully processed.

      Here are some important details for you:

      - **Event Name**: ${eventDetails.title}
      - **Date**: ${eventDetails.date}
      - **Venue**: ${eventDetails.location}

      We recommend arriving a bit early, and please feel free to reach out if you have any questions.

      Can't wait to see you there!

      Cheers,
      The EventCrew Team
      `,
    };

    const emailInfo = await emailTransporter.sendMail(message);
    console.log('Confirmation email sent: %s', emailInfo.messageId);
  } catch (err) {
    console.error('Failed to send email:', err);
  }
};

module.exports = { sendConfirmationEmail };
