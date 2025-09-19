// Types
export type TemplateParams = {
  name?: string;
  resetLink: string;
  companyName?: string;
  currentYear?: number;
};

export const resetLinkTemplate = ({
  name,
  resetLink,
  companyName = 'Shortly',
  currentYear = new Date().getFullYear(),
}: TemplateParams): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
        p {margin: 0;}
        a {text-decoration: none; !important; color: inherit; !important;}
        .container {
            font-family: Arial, sans-serif;
            font-size: 16px !important;
            color: #111;  
            max-width: 600px;
            margin: auto;
            background-color: #fff;
        }
        .wrapper {
            border: 1px solid #ddd;
            border-radius: 16px;
            overflow: hidden;
        }
        .header, .footer {
            padding: 32px;
            background-color: #c5f0a4;
            color: #0f1709;
        }
        .logo {
            display: block;
            margin: 0 auto 12px;
        }
        .title {
            font-size: 20px;
            font-weight: bold;
        }
        .content: {
            padding: 32px;
        }
        .button {
            display: block;
            text-align: center;
            padding: 16px;
            font-weight: bold;
            background-color: #c5f0a4;
            color: #0f1709 !important;
            border-radius: 10px;
        }
        .footer {margin-top: 32px;}
        .footer-text {
            font-size: 13px;
            color: #444;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="wrapper">
                <div class="header">
                    <img src="" width="147" height="36" class="logo" alt="${companyName}" />
                    <div class="title">Reset your password</div>
                </div>
                <div class="content">
                    <p style="margin-bottom: 20px"><strong>Hey ${name}, </strong></p>
                    <p style="margin-bottom: 20px">
                        We received a request to reset your password accociated with your account.
                        <br />
                        Click the button below to reset your password.
                    </p>

                    <a href="${resetLink}" class="button" style="margin-bottom: 20px">
                    Reset your password
                    </a>

                    <p style="margin-bottom: 20px">
                        This link will expire in 1 hour for your security. If you did not request a password reset, 
                        you can safely ignore this email, your password will remain unchanged.
                    </p>
                </div>
            </div>

            <div class="footer">
                <div class="footer-text">
                    If you need help, feel free to contact our support team

                    <a href="mailto:support@@example.com" class="footer-text">
                        <strong>support@@example.com</strong>
                    </a>
                </div>
                <div style="margin-top: 12px;" class="footer-text">
                    &copy; ${currentYear} ${companyName} - All rights reserved
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};
