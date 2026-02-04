import { forgotPassword } from './src/controllers/authController.js';
import dotenv from 'dotenv';
dotenv.config();

// Mock request and response objects
const mockRequest = {
    body: {
        email: 'dubeyshashank444@gmail.com'
    }
};

const mockResponse = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        this.data = data;
        console.log('📤 Response Status:', this.statusCode);
        console.log('📤 Response Data:', this.data);
        return this;
    }
};

async function testPasswordResetFlow() {
    console.log('🔐 Testing Real Password Reset Flow\n');
    console.log('📧 Email:', mockRequest.body.email);
    console.log('');
    
    try {
        await forgotPassword(mockRequest, mockResponse);
        
        if (mockResponse.statusCode === 200 && mockResponse.data.success) {
            console.log('✅ SUCCESS! Password reset flow working');
            console.log('📧 OTP email sent to:', mockRequest.body.email);
            console.log('🔢 Check your email for OTP');
        } else {
            console.log('❌ Password reset flow failed');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

console.log('═══════════════════════════════════════════');
console.log('   🔐 REAL PASSWORD RESET FLOW TEST');
console.log('═══════════════════════════════════════════\n');

testPasswordResetFlow();
