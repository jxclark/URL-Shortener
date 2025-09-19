// Node modules
import nodemail from 'nodemailer';

// Custom mdoules
import config from '@/config';

const nodemailerTransport = nodemail.createTransport({
  host: config.EMAIL_HOST,
  port: 587,
  //   secure: true,
  auth: {
    user: config.EMAIL_USERNAME,
    pass: config.EMAIL_PASSWORD,
  },
});

export default nodemailerTransport;
