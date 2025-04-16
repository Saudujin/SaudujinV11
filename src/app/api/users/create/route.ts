import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();
    
    const { fullName, email, countryCode, phoneNumber, location, favoriteGames, language } = req.body;
    
    // Validate required fields
    if (!fullName || !email || !countryCode || !phoneNumber || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phoneNumber: phoneNumber.replace(/^\+/, '') } // Remove + prefix if present
      ]
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists',
        field: existingUser.email === email ? 'email' : 'phoneNumber'
      });
    }
    
    // Create new user
    const user = new User({
      fullName,
      email,
      countryCode,
      phoneNumber: phoneNumber.replace(/^\+/, ''), // Store without + prefix
      location,
      favoriteGames: favoriteGames || [],
      language: language || 'en',
      isVerified: false,
    });
    
    await user.save();
    
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isVerified: user.isVerified
      }
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    return res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  }
}
