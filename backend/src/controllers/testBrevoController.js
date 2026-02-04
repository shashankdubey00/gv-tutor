import * as brevo from '@getbrevo/brevo';
import dotenv from 'dotenv';
dotenv.config();

export const testBrevoDirectly = async (req, res) => {
    try {
        console.log('🧪 Testing Brevo API directly...\n');
        
        const apiInstance = new brevo.TransactionalEmailsApi();
        apiInstance.setApiKey(
            brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.BREVO_API_KEY
        );
        
        const sendSmtpEmail = new brevo.SendSmtpEmail();
        
        // Use Brevo's verified sender
        sendSmtpEmail.sender = {
            name: 'GV Tutor Test',
            email: 'no-reply@brevo.com'  // Brevo verified sender
        };
        
        sendSmtpEmail.to = [{ 
            email: 'dubeyshashank444@gmail.com' 
        }];
        
        sendSmtpEmail.subject = '🧪 Direct Brevo Test - ' + new Date().toLocaleString();
        sendSmtpEmail.htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1>🧪 Direct Brevo API Test</h1>
                </div>
                <div style="background: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #4CAF50;">✅ Brevo API Working!</h2>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Sender:</strong> no-reply@brevo.com</p>
                    <p><strong>To:</strong> dubeyshashank444@gmail.com</p>
                    <p style="margin-top: 20px; color: #666;">
                        This is a direct test of the Brevo API. If you receive this email, 
                        the API connection is working perfectly!
                    </p>
                </div>
            </div>
        `;

        console.log('📤 Sending test email with Brevo verified sender...');
        console.log('📧 From: no-reply@brevo.com');
        console.log('📧 To: dubeyshashank444@gmail.com');
        
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail);

        console.log('✅ SUCCESS! Direct Brevo test email sent!');
        console.log('📨 Message ID:', result.messageId);
        
        res.status(200).json({
            success: true,
            message: 'Direct Brevo test email sent successfully',
            messageId: result.messageId,
            sender: 'no-reply@brevo.com',
            recipient: 'dubeyshashank444@gmail.com'
        });
        
    } catch (error) {
        console.error('❌ Direct Brevo test failed:', error.message);
        
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Details:', JSON.stringify(error.response.body, null, 2));
        }
        
        res.status(500).json({
            success: false,
            message: 'Direct Brevo test failed',
            error: error.message
        });
    }
};
