import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/app/lib/db';
import User from '@/app/models/User';
import Attendance from '@/app/models/Attendance';
import Tournament from '@/app/models/Tournament';

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
    
    // Get upcoming tournaments
    const now = new Date();
    const upcomingTournaments = await Tournament.find({
      date: { $gt: now }
    }).sort({ date: 1 }).limit(5);
    
    // Get user's registered tournaments
    const userRegistrations = await Attendance.find({
      user: userId,
      attendanceStatus: { $in: ['registered', 'approved'] }
    }).select('tournament');
    
    const registeredTournamentIds = userRegistrations.map(reg => reg.tournament.toString());
    
    // Format upcoming tournaments
    const formattedUpcomingTournaments = upcomingTournaments.map(tournament => ({
      id: tournament._id.toString(),
      title: tournament.title,
      game: tournament.game,
      date: tournament.date,
      location: tournament.location,
      isRegistered: registeredTournamentIds.includes(tournament._id.toString())
    }));
    
    // Generate activity feed
    const activities = [];
    
    // Add registration activities
    const registrations = await Attendance.find({
      user: userId,
      attendanceStatus: { $in: ['registered', 'approved'] }
    }).populate('tournament').sort({ createdAt: -1 }).limit(5);
    
    registrations.forEach(registration => {
      activities.push({
        id: `registration-${registration._id.toString()}`,
        type: 'registration',
        title: t('dashboard.activity.registeredTournament'),
        description: registration.tournament.title,
        date: registration.createdAt,
        relatedId: registration.tournament._id.toString(),
        relatedType: 'tournaments'
      });
    });
    
    // Add attendance activities
    attendanceRecords.forEach(attendance => {
      activities.push({
        id: `attendance-${attendance._id.toString()}`,
        type: 'attendance',
        title: t('dashboard.activity.attendedTournament'),
        description: attendance.tournament.title,
        date: attendance.checkedInAt || attendance.updatedAt,
        relatedId: attendance.tournament._id.toString(),
        relatedType: 'tournaments'
      });
    });
    
    // Add reward activities
    if (rewards.scarf) {
      activities.push({
        id: 'reward-scarf',
        type: 'reward',
        title: t('dashboard.activity.rewardUnlocked'),
        description: t('loyalty.rewards.scarf'),
        date: attendanceRecords[0].checkedInAt || attendanceRecords[0].updatedAt,
      });
    }
    
    if (rewards.vipTicket) {
      activities.push({
        id: 'reward-vipTicket',
        type: 'reward',
        title: t('dashboard.activity.rewardUnlocked'),
        description: t('loyalty.rewards.vipTicket'),
        date: attendanceRecords[2].checkedInAt || attendanceRecords[2].updatedAt,
      });
    }
    
    if (rewards.jersey) {
      activities.push({
        id: 'reward-jersey',
        type: 'reward',
        title: t('dashboard.activity.rewardUnlocked'),
        description: t('loyalty.rewards.jersey'),
        date: attendanceRecords[9].checkedInAt || attendanceRecords[9].updatedAt,
      });
    }
    
    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        location: user.location,
        favoriteGames: user.favoriteGames,
      },
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
      upcomingTournaments: formattedUpcomingTournaments,
      activities
    });
  } catch (error: any) {
    console.error('Dashboard data error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch dashboard data',
      details: error.message 
    });
  }
}

// Helper function for translation
function t(key: string, params?: any) {
  // This is a simplified version for the API
  const translations = {
    'dashboard.activity.registeredTournament': 'Registered for Tournament',
    'dashboard.activity.attendedTournament': 'Attended Tournament',
    'dashboard.activity.rewardUnlocked': 'Reward Unlocked',
    'loyalty.rewards.scarf': 'Falcons Scarf',
    'loyalty.rewards.vipTicket': 'VIP Ticket',
    'loyalty.rewards.jersey': 'Falcons Jersey'
  };
  
  return translations[key] || key;
}
