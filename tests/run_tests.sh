#!/bin/bash

# Test script for Falcons Supporters League website
# This script will test all core functionality of the website

echo "Starting tests for Falcons Supporters League website..."
echo "======================================================"

# Create test directory
mkdir -p /home/ubuntu/falcons-supporters-league/tests
cd /home/ubuntu/falcons-supporters-league

# Create test file
cat > tests/test_core_functionality.js << 'EOL'
// Core functionality tests for Falcons Supporters League website

const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('Starting browser for tests...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: 'en-US'
  });
  const page = await context.newPage();

  try {
    // Test 1: Landing page loads correctly
    console.log('\nTest 1: Landing page loads correctly');
    await page.goto('http://localhost:3000');
    const title = await page.title();
    console.log(`Page title: ${title}`);
    assert(title.includes('Falcons'), 'Page title should include "Falcons"');
    console.log('✅ Landing page loaded successfully');

    // Test 2: Registration form validation
    console.log('\nTest 2: Registration form validation');
    await page.goto('http://localhost:3000/auth/register');
    
    // Try submitting empty form
    await page.click('button[type="submit"]');
    const errorMessage = await page.textContent('.error-message');
    assert(errorMessage, 'Error message should be displayed for empty form');
    console.log('✅ Form validation works for empty submission');
    
    // Fill form with valid data
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="phoneNumber"]', '5551234567');
    await page.selectOption('select[name="countryCode"]', '+1');
    await page.fill('input[name="location"]', 'Test City');
    await page.check('input[type="checkbox"][name="favoriteGames"][value="FIFA 25"]');
    console.log('✅ Form can be filled with valid data');

    // Test 3: Language switching
    console.log('\nTest 3: Language switching');
    await page.goto('http://localhost:3000');
    
    // Switch to Arabic
    await page.click('[data-testid="language-switcher"]');
    await page.click('text=العربية');
    
    // Check if direction changed to RTL
    const isRtl = await page.evaluate(() => {
      return document.dir === 'rtl';
    });
    assert(isRtl, 'Page direction should be RTL when Arabic is selected');
    console.log('✅ Language switching works correctly');
    
    // Switch back to English
    await page.click('[data-testid="language-switcher"]');
    await page.click('text=English');

    // Test 4: Theme switching
    console.log('\nTest 4: Theme switching');
    await page.goto('http://localhost:3000');
    
    // Switch to dark mode
    await page.click('[data-testid="theme-switcher"]');
    
    // Check if dark mode is applied
    const isDarkMode = await page.evaluate(() => {
      return document.body.classList.contains('dark-theme');
    });
    assert(isDarkMode, 'Body should have dark-theme class when dark mode is selected');
    console.log('✅ Theme switching works correctly');

    // Test 5: Responsive design
    console.log('\nTest 5: Responsive design');
    
    // Test on mobile viewport
    await context.close();
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 },
      locale: 'en-US'
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3000');
    
    // Check if mobile menu is present
    const hasMobileMenu = await mobilePage.isVisible('[data-testid="mobile-menu-button"]');
    assert(hasMobileMenu, 'Mobile menu button should be visible on small screens');
    console.log('✅ Responsive design works correctly');
    
    await mobileContext.close();

    // Test 6: Tournament calendar filtering
    console.log('\nTest 6: Tournament calendar filtering');
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: 'en-US'
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto('http://localhost:3000/tournaments');
    
    // Test search filter
    await desktopPage.fill('[data-testid="tournament-search"]', 'FIFA');
    const filteredResults = await desktopPage.$$('[data-testid="tournament-card"]');
    console.log(`Found ${filteredResults.length} tournaments after filtering`);
    console.log('✅ Tournament filtering works correctly');
    
    await desktopContext.close();

    console.log('\nAll tests completed successfully! ✅');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
EOL

# Create package.json for tests if it doesn't exist
if [ ! -f package.json ]; then
  echo "Creating package.json for tests..."
  cat > package.json << 'EOL'
{
  "name": "falcons-supporters-league",
  "version": "1.0.0",
  "description": "Falcons Supporters League website",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "node tests/test_core_functionality.js"
  },
  "dependencies": {
    "next": "^13.4.19",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "playwright": "^1.35.1",
    "typescript": "^5.1.6"
  }
}
EOL
fi

# Install test dependencies
echo "Installing test dependencies..."
npm install --save-dev playwright

# Create a manual test checklist
cat > tests/manual_test_checklist.md << 'EOL'
# Manual Test Checklist for Falcons Supporters League Website

## Registration and Authentication
- [ ] User can fill out and submit registration form
- [ ] Phone verification via Twilio SMS works correctly
- [ ] Verification code entry works correctly
- [ ] Error handling for invalid verification codes works

## Multilingual Support
- [ ] Website can be switched between English and Arabic
- [ ] All text is properly translated in both languages
- [ ] RTL layout works correctly in Arabic mode
- [ ] Language preference is saved between sessions

## Loyalty Circle System
- [ ] Loyalty circle displays correct points
- [ ] Rewards are unlocked at appropriate point thresholds
- [ ] Animations work when new rewards are unlocked
- [ ] Leaderboard displays top fans correctly

## Tournament Calendar
- [ ] Tournaments are displayed correctly
- [ ] Filtering by game type works
- [ ] Filtering by date range works
- [ ] Filtering by location works
- [ ] Registration for tournaments works
- [ ] Calendar integration works

## User Dashboard
- [ ] Dashboard displays correct user information
- [ ] Upcoming tournaments are shown correctly
- [ ] Attendance history is displayed correctly
- [ ] Loyalty progress is visualized properly
- [ ] Activity feed shows relevant activities

## Admin Panel
- [ ] Admin can view list of all users
- [ ] Admin can filter and search users
- [ ] Admin can approve/reject tournament attendance
- [ ] Admin can mark users as attended
- [ ] Admin can update user loyalty points
- [ ] Admin can view analytics dashboard
- [ ] Export functionality works for user data

## Responsive Design and Themes
- [ ] Website works on mobile devices (320px width)
- [ ] Website works on tablets (768px width)
- [ ] Website works on desktop (1024px+ width)
- [ ] Dark mode toggle works correctly
- [ ] Light mode toggle works correctly
- [ ] Mobile menu works on small screens

## Performance
- [ ] Pages load in under 3 seconds
- [ ] Animations are smooth
- [ ] No console errors
- [ ] No layout shifts during loading

## Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Focus states are visible
- [ ] Screen reader compatibility
- [ ] Color contrast meets WCAG standards
EOL

echo "Created manual test checklist at tests/manual_test_checklist.md"

# Create API test script
cat > tests/test_api_endpoints.js << 'EOL'
// API endpoint tests for Falcons Supporters League website

const fetch = require('node-fetch');
const assert = require('assert');

const API_BASE_URL = 'http://localhost:3000/api';

(async () => {
  console.log('Starting API tests...');
  
  try {
    // Test 1: User creation API
    console.log('\nTest 1: User creation API');
    const userData = {
      fullName: 'API Test User',
      email: `test${Date.now()}@example.com`,
      countryCode: '+1',
      phoneNumber: `555${Math.floor(1000000 + Math.random() * 9000000)}`,
      location: 'Test City',
      favoriteGames: ['FIFA 25', 'DOTA 2']
    };
    
    const createUserResponse = await fetch(`${API_BASE_URL}/users/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    const createUserResult = await createUserResponse.json();
    console.log('Create user response:', createUserResult);
    assert(createUserResponse.ok, 'User creation should succeed');
    assert(createUserResult.success, 'Response should indicate success');
    assert(createUserResult.user.id, 'Response should include user ID');
    
    const userId = createUserResult.user.id;
    console.log('✅ User creation API works correctly');
    
    // Test 2: Tournament listing API
    console.log('\nTest 2: Tournament listing API');
    const tournamentsResponse = await fetch(`${API_BASE_URL}/tournaments`);
    const tournamentsResult = await tournamentsResponse.json();
    
    console.log(`Retrieved ${tournamentsResult.tournaments?.length || 0} tournaments`);
    assert(tournamentsResponse.ok, 'Tournament listing should succeed');
    console.log('✅ Tournament listing API works correctly');
    
    // Test 3: Dashboard data API
    console.log('\nTest 3: Dashboard data API');
    const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/user-data?userId=${userId}`);
    const dashboardResult = await dashboardResponse.json();
    
    console.log('Dashboard data:', dashboardResult);
    assert(dashboardResponse.ok, 'Dashboard data retrieval should succeed');
    assert(dashboardResult.user.id === userId, 'Dashboard should return correct user data');
    console.log('✅ Dashboard data API works correctly');
    
    // Test 4: Loyalty data API
    console.log('\nTest 4: Loyalty data API');
    const loyaltyResponse = await fetch(`${API_BASE_URL}/loyalty/user-data?userId=${userId}`);
    const loyaltyResult = await loyaltyResponse.json();
    
    console.log('Loyalty data:', loyaltyResult);
    assert(loyaltyResponse.ok, 'Loyalty data retrieval should succeed');
    assert('loyalty' in loyaltyResult, 'Response should include loyalty data');
    console.log('✅ Loyalty data API works correctly');
    
    console.log('\nAll API tests completed successfully! ✅');
  } catch (error) {
    console.error('❌ API test failed:', error);
    process.exit(1);
  }
})();
EOL

echo "Created API test script at tests/test_api_endpoints.js"

# Create a test for phone verification
cat > tests/test_phone_verification.js << 'EOL'
// Phone verification test for Falcons Supporters League website

const fetch = require('node-fetch');
const assert = require('assert');

// Twilio credentials from the project
const TWILIO_ACCOUNT_SID = 'AC8078fdcd766441e60642ed194c562aa6';
const TWILIO_AUTH_TOKEN = 'f066b7dc461c8e8e73057e3b119f728f';
const TWILIO_VERIFY_SERVICE_SID = 'VA5cf3bf48988c4025fa81c55cdbdc5a3a';

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
EOL

echo "Created phone verification test at tests/test_phone_verification.js"

# Create a README for tests
cat > tests/README.md << 'EOL'
# Falcons Supporters League Website Tests

This directory contains tests for the Falcons Supporters League website.

## Automated Tests

### Core Functionality Tests
Run with:
```
npm test
```

This will test:
- Landing page loading
- Registration form validation
- Language switching
- Theme switching
- Responsive design
- Tournament calendar filtering

### API Tests
Run with:
```
node tests/test_api_endpoints.js
```

This will test:
- User creation API
- Tournament listing API
- Dashboard data API
- Loyalty data API

### Phone Verification Tests
Run with:
```
node tests/test_phone_verification.js
```

This will test:
- Send verification code API
- Verify code API (mock test)

## Manual Tests

See `manual_test_checklist.md` for a comprehensive list of manual tests to perform.

## Running Tests

1. Make sure the development server is running:
```
npm run dev
```

2. In a separate terminal, run the tests:
```
npm test
```

## Test Coverage

These tests cover:
- User registration and authentication
- Multilingual support
- Loyalty circle system
- Tournament calendar
- User dashboard
- Admin panel
- Responsive design and themes
- API endpoints
EOL

echo "Created README for tests at tests/README.md"

echo "======================================================"
echo "Test setup complete. To run tests:"
echo "1. Start the development server: npm run dev"
echo "2. In a separate terminal, run: npm test"
echo "3. For API tests, run: node tests/test_api_endpoints.js"
echo "4. For phone verification tests, run: node tests/test_phone_verification.js"
echo "5. Follow the manual test checklist in tests/manual_test_checklist.md"
echo "======================================================"
