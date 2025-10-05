export function getVerificationEmailHtml(code: string): string {
    return `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Verification Code</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                        <h2 style="color: #333333;">Email Verification</h2>
                        <p>Hi there,</p>
                        <p>Use the following code to verify your email address:</p>
                        <div style="font-size: 24px; font-weight: bold; color: #1a73e8; margin: 20px 0;">
                            ${code}
                        </div>
                        <p>This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
                        <p>Thanks,<br/>Your Company Name</p>
                    </div>
                </body>
            </html>
        `;
}
