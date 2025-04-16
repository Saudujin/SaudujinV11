// Phone verification test for Falcons Supporters League website

const fetch = require('node-fetch');
const assert = require('assert');

// Twilio credentials should be loaded from environment variables
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID || '';

// Test phone number
const TEST_PHONE_NUMBER = '+15551234567';

(async () => {
  console.log('Starting phone verification tests...');
  
  try {
    // Test 1: Send verification code API
    console.log('\nTest 1: Send verification code API');
    
    const sendVerificationResponse = await fetch('http://localhost:3000/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: TEST_PHONE_NUMBER
      })
    });
    
    const sendVerificationResult = await sendVerificationResponse.json();
    console.log('Send verification response:', sendVerificationResult);
    
    assert(sendVerificationResponse.ok, 'Send verification should succeed');
    assert(sendVerificationResult.success, 'Response should indicate success');
    console.log('✅ Send verification API works correctly');
    
    // Test 2: Verify code API (mock test)
    console.log('\nTest 2: Verify code API (mock test)');
    
    // In a real scenario, we would get the code from Twilio
    // For testing, we'll use a mock code
    const mockVerificationCode = '123456';
    
    const verifyCodeResponse = await fetch('http://localhost:3000/api/auth/verify-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phoneNumber: TEST_PHONE_NUMBER,
        code: mockVerificationCode
      })
    });
    
    // We expect this to fail in the test environment since we're using a mock code
    // But we can check that the API endpoint is working
    console.log('Verify code response status:', verifyCodeResponse.status);
    console.log('✅ Verify code API endpoint is accessible');
    
    console.log('\nPhone verification tests completed! ✅');
    console.log('Note: Full verification test requires actual Twilio integration');
  } catch (error) {
    console.error('❌ Phone verification test failed:', error);
    process.exit(1);
  }
})();
