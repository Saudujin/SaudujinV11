import { NextApiRequest, NextApiResponse } from 'next';
import twilio from 'twilio';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';

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
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({ error: 'Phone number and verification code are required' });
    }

    // Verify the code
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code
      });

    if (verification.status === 'approved') {
      // Connect to database
      await dbConnect();
      
      // Update user verification status
      const updatedUser = await User.findOneAndUpdate(
        { phoneNumber: phoneNumber.replace(/^\+/, '') }, // Remove + prefix if present
        { isVerified: true },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ 
        success: true, 
        status: verification.status,
        message: 'Phone number verified successfully',
        user: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          phoneNumber: updatedUser.phoneNumber,
          isVerified: updatedUser.isVerified
        }
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        status: verification.status,
        message: 'Invalid verification code' 
      });
    }
  } catch (error: any) {
    console.error('Twilio verification check error:', error);
    return res.status(500).json({ 
      error: 'Failed to verify code',
      details: error.message 
    });
  }
}
