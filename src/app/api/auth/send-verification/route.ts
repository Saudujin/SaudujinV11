import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';

// Initialize Twilio client with credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC8078fdcd766441e60642ed194c562aa6';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'f066b7dc461c8e8e73057e3b119f728f';
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || 'VA5cf3bf48988c4025fa81c55cdbdc5a3a';

const client = twilio(accountSid, authToken);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Send verification code via SMS
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms'
      });

    return res.status(200).json({ 
      success: true, 
      status: verification.status,
      message: 'Verification code sent successfully' 
    });
  } catch (error: any) {
    console.error('Twilio verification error:', error);
    return res.status(500).json({ 
      error: 'Failed to send verification code',
      details: error.message 
    });
  }
}
