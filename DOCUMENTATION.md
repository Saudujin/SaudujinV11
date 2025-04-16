# Falcons Supporters League Website Documentation

## Project Overview

The Falcons Supporters League website is a fan engagement platform for the esports team Falcons, specifically designed for the Esports World Cup 2025 (EWC 2025) tournaments. The platform helps build a database of fans, track participation in tournaments, and reward loyalty through a gamified system.

## Technical Stack

- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with phone verification via Twilio
- **Internationalization**: i18n for English and Arabic support
- **Styling**: Tailwind CSS with custom theming system
- **Deployment**: Vercel (recommended)

## Core Features

### 1. User Registration and Authentication

The registration system collects essential user information and verifies phone numbers using Twilio's SMS verification service.

**Key Components:**
- `RegistrationForm.tsx`: Collects user information
- `VerificationForm.tsx`: Handles phone verification
- `api/auth/send-verification`: Sends verification codes via Twilio
- `api/auth/verify-code`: Verifies the entered code
- `api/users/create`: Creates new user records in the database

**Implementation Details:**
- Two-step registration process: information collection followed by phone verification
- Secure storage of user data with password hashing
- JWT token generation for authenticated sessions
- Rate limiting to prevent abuse

### 2. Multilingual Support

The website supports both English and Arabic languages with proper RTL (Right-to-Left) layout for Arabic.

**Key Components:**
- `LocaleContext.tsx`: Context provider for language state
- `LanguageSelector.tsx`: UI component for switching languages
- `LanguageLayout.tsx`: Layout component that handles RTL/LTR direction
- `useMultilingual.ts`: Custom hooks for RTL styling and translations
- `RtlComponents.tsx`: RTL-aware UI components

**Implementation Details:**
- Language detection based on browser settings
- Language persistence in localStorage
- Dynamic RTL/LTR switching
- Separate translation files for each language

### 3. Loyalty Circle System

A gamified loyalty system that tracks user participation and rewards engagement with tiered rewards.

**Key Components:**
- `LoyaltyCircleSystem.tsx`: Visual representation of loyalty progress
- `RewardCard.tsx`: Displays individual rewards
- `LoyaltyLeaderboard.tsx`: Shows top fans
- `SocialShareCard.tsx`: Allows sharing achievements
- `api/loyalty/user-data`: Retrieves loyalty data for users

**Implementation Details:**
- Points awarded for tournament attendance
- Three reward tiers: scarf (1 point), VIP ticket (3 points), jersey (10 points)
- Animated celebrations when reaching new tiers
- Leaderboard showing top fans
- Social sharing functionality

### 4. Tournament Calendar

A comprehensive calendar of Esports World Cup 2025 tournaments with registration functionality.

**Key Components:**
- `TournamentCard.tsx`: Displays individual tournament information
- `TournamentFilters.tsx`: Filtering options for tournaments
- `TournamentCalendar.tsx`: Main component for displaying tournaments
- `api/tournaments`: API endpoints for tournament data

**Implementation Details:**
- Multiple view modes: grid, list, and map
- Filtering by game type, date range, and location
- Registration functionality with capacity tracking
- Calendar integration for adding events to personal calendars
- Countdown timers for upcoming tournaments

### 5. User Dashboard

A personalized dashboard showing user information, upcoming tournaments, and loyalty progress.

**Key Components:**
- `UserDashboard.tsx`: Main dashboard component
- `UserRewards.tsx`: Displays available rewards
- `ActivityFeed.tsx`: Shows recent user activities
- `api/dashboard/user-data`: Retrieves dashboard data

**Implementation Details:**
- Overview of upcoming tournaments
- Visualization of loyalty progress
- Attendance history
- Activity feed with recent actions
- Profile information display

### 6. Admin Panel

A secure admin interface for managing users, tournaments, and loyalty.

**Key Components:**
- `UserList.tsx`: Comprehensive user management
- `AttendanceApproval.tsx`: Manual approval system for attendance
- `AnalyticsDashboard.tsx`: Key metrics and analytics
- `LoyaltyManagement.tsx`: Tools for managing loyalty points
- `api/admin/*`: Admin-specific API endpoints

**Implementation Details:**
- User management with filtering and search
- Manual approval system for tournament attendance
- Analytics dashboard with key metrics
- Export functionality for user data
- Loyalty management tools

### 7. Responsive Design and Themes

The website is fully responsive and supports both light and dark modes.

**Key Components:**
- `theme.tsx`: Theme definitions and CSS variables
- `globals.css`: Global styles and responsive classes
- `useResponsive.tsx`: Responsive design utilities
- `ThemeContext.tsx`: Context provider for theme state
- `ThemeSwitcher.tsx`: UI component for switching themes
- `MobileMenu.tsx`: Mobile-friendly navigation

**Implementation Details:**
- CSS variables for theming
- Responsive breakpoints for different device sizes
- Dark mode support with system preference detection
- Mobile-first approach to design
- Touch-friendly interactions for mobile devices

## Database Schema

### User Model
- `fullName`: String (required)
- `email`: String (required, unique)
- `phoneNumber`: String (required, unique)
- `countryCode`: String (required)
- `location`: String (required)
- `favoriteGames`: Array of Strings
- `isVerified`: Boolean
- `language`: String (default: 'en')
- `createdAt`: Date
- `updatedAt`: Date

### Tournament Model
- `title`: String (required)
- `game`: String (required)
- `date`: Date (required)
- `location`: String (required)
- `description`: String
- `capacity`: Number (required)
- `registeredCount`: Number (default: 0)
- `isPriorityEvent`: Boolean (default: false)
- `loyaltyPoints`: Number (default: 1)
- `createdAt`: Date
- `updatedAt`: Date

### Attendance Model
- `user`: ObjectId (ref: 'User')
- `tournament`: ObjectId (ref: 'Tournament')
- `registrationDate`: Date
- `attendanceStatus`: String (enum: ['registered', 'approved', 'rejected', 'attended'])
- `checkedInAt`: Date
- `checkedInBy`: ObjectId (ref: 'Admin')
- `loyaltyPointsEarned`: Number
- `createdAt`: Date
- `updatedAt`: Date

### Admin Model
- `username`: String (required, unique)
- `password`: String (required)
- `fullName`: String (required)
- `role`: String (enum: ['admin', 'superadmin'])
- `createdAt`: Date
- `updatedAt`: Date

## API Endpoints

### Authentication
- `POST /api/auth/send-verification`: Send verification code
- `POST /api/auth/verify-code`: Verify code and authenticate
- `POST /api/auth/login`: Admin login
- `GET /api/auth/logout`: Logout

### Users
- `POST /api/users/create`: Create new user
- `GET /api/users/:id`: Get user by ID
- `PUT /api/users/:id`: Update user
- `GET /api/users`: Get all users (admin only)

### Tournaments
- `GET /api/tournaments`: Get all tournaments
- `GET /api/tournaments/:id`: Get tournament by ID
- `POST /api/tournaments`: Create tournament (admin only)
- `PUT /api/tournaments/:id`: Update tournament (admin only)
- `DELETE /api/tournaments/:id`: Delete tournament (admin only)

### Attendance
- `POST /api/attendance/register`: Register for tournament
- `GET /api/attendance/user/:userId`: Get user's attendance
- `PUT /api/attendance/:id/status`: Update attendance status (admin only)
- `GET /api/attendance/tournament/:tournamentId`: Get attendance for tournament (admin only)

### Loyalty
- `GET /api/loyalty/user-data`: Get user's loyalty data
- `GET /api/loyalty/leaderboard`: Get loyalty leaderboard
- `PUT /api/loyalty/update-points`: Update loyalty points (admin only)
- `POST /api/loyalty/award-reward`: Award reward manually (admin only)

### Dashboard
- `GET /api/dashboard/user-data`: Get user's dashboard data
- `GET /api/dashboard/admin-overview`: Get admin dashboard overview (admin only)

### Admin
- `GET /api/admin/analytics`: Get analytics data
- `GET /api/admin/export-users`: Export user data
- `GET /api/admin/export-attendance`: Export attendance data

## Directory Structure

```
falcons-supporters-league/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/
│   │   │   │   ├── register/
│   │   │   │   └── verify/
│   │   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── tournaments/
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── tournaments/
│   │   │   ├── attendance/
│   │   │   ├── loyalty/
│   │   │   └── admin/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── forms/
│   │   │   ├── landing/
│   │   │   ├── layout/
│   │   │   ├── loyalty/
│   │   │   ├── tournaments/
│   │   │   ├── ui/
│   │   │   └── test/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── models/
│   │   ├── services/
│   │   ├── styles/
│   │   └── utils/
│   └── public/
│       └── images/
├── tests/
├── .env.local
├── .env.production
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── DEPLOYMENT.md
└── README.md
```

## Testing

The project includes comprehensive testing:

### Automated Tests
- Core functionality tests
- API endpoint tests
- Phone verification tests

### Manual Tests
- User registration and authentication
- Multilingual support
- Loyalty circle system
- Tournament calendar
- User dashboard
- Admin panel
- Responsive design and themes

## Deployment

The website can be deployed using several methods:

1. **Vercel (Recommended)**
   - Connect GitHub repository to Vercel
   - Set up environment variables
   - Deploy with one click

2. **Manual Deployment**
   - Build the project
   - Copy files to server
   - Set up environment variables
   - Start the application
   - Configure web server

3. **Docker Deployment**
   - Use provided Dockerfile and docker-compose.yml
   - Build and run the container

Detailed deployment instructions are available in `DEPLOYMENT.md`.

## Security Considerations

- Phone verification to prevent fake accounts
- JWT for secure authentication
- Rate limiting to prevent abuse
- Input validation on all forms
- Secure API endpoints with proper authorization
- Environment variables for sensitive information
- HTTPS enforcement in production

## Performance Optimizations

- Server-side rendering for improved SEO
- Static generation for static pages
- Image optimization
- Code splitting
- Lazy loading of components
- Caching strategies
- Minimized JavaScript and CSS

## Accessibility

- Semantic HTML
- ARIA attributes
- Keyboard navigation
- Focus management
- Color contrast compliance
- Screen reader compatibility
- Responsive design for all devices

## Future Enhancements

Potential future enhancements for the platform:

1. Social login options (Google, Facebook, Twitter)
2. Push notifications for tournament reminders
3. In-app messaging system
4. Enhanced analytics dashboard
5. Integration with streaming platforms
6. Mobile app version
7. Merchandise store integration
8. Fan content creation and sharing

## Troubleshooting

Common issues and solutions:

1. **Database Connection Issues**
   - Check MongoDB connection string
   - Verify network connectivity
   - Check database user permissions

2. **Twilio Verification Issues**
   - Verify Twilio credentials
   - Check phone number format
   - Monitor Twilio logs

3. **Deployment Issues**
   - Check environment variables
   - Verify build process
   - Check server logs

4. **Performance Issues**
   - Monitor server resources
   - Optimize database queries
   - Implement caching

## Support and Maintenance

For support and maintenance:

1. Regular updates to dependencies
2. Security patches
3. Database backups
4. Performance monitoring
5. User feedback collection and implementation

## Conclusion

The Falcons Supporters League website provides a comprehensive platform for fan engagement, tournament participation tracking, and loyalty rewards. The implementation prioritizes functionality, security, and user experience while maintaining flexibility for future enhancements.
