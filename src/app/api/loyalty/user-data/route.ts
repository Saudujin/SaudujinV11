import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import Attendance from '@/app/models/Attendance';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await dbConnect();
    
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Get user data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's attendance records
    const attendanceRecords = await Attendance.find({ 
      user: userId,
      attendanceStatus: 'attended'
    }).populate('tournament');
    
    // Calculate loyalty points and rewards
    const loyaltyPoints = attendanceRecords.length;
    
    const rewards = {
      scarf: loyaltyPoints >= 1,
      vipTicket: loyaltyPoints >= 3,
      jersey: loyaltyPoints >= 10
    };
    
    // Get leaderboard data (top 10 users by attendance)
    const leaderboardData = await User.aggregate([
      {
        $lookup: {
          from: 'attendances',
          localField: '_id',
          foreignField: 'user',
          as: 'attendances'
        }
      },
      {
        $addFields: {
          attendanceCount: {
            $size: {
              $filter: {
                input: '$attendances',
                as: 'attendance',
                cond: { $eq: ['$$attendance.attendanceStatus', 'attended'] }
              }
            }
          }
        }
      },
      { $sort: { attendanceCount: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 1,
          fullName: 1,
          attendanceCount: 1
        }
      }
    ]);
    
    // Format leaderboard data
    const leaderboard = leaderboardData.map((leader, index) => ({
      id: leader._id.toString(),
      name: leader.fullName,
      points: leader.attendanceCount,
      rank: index + 1
    }));
    
    // Find user's rank in leaderboard
    const userRank = leaderboard.findIndex(leader => leader.id === userId.toString()) + 1;
    
    return res.status(200).json({
      success: true,
      loyalty: {
        points: loyaltyPoints,
        maxPoints: 10, // Maximum points for all rewards
        rewards,
        attendedEvents: attendanceRecords.map(record => ({
          id: record._id.toString(),
          tournamentId: record.tournament._id.toString(),
          tournamentTitle: record.tournament.title,
          date: record.tournament.date,
          pointsEarned: record.loyaltyPointsEarned || 1
        }))
      },
      leaderboard,
      userRank: userRank > 0 ? userRank : null
    });
  } catch (error: any) {
    console.error('Loyalty data error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch loyalty data',
      details: error.message 
    });
  }
}
