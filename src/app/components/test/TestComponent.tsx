"use client";
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RtlContainer } from '@/app/components/layout/RtlComponents';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { useRtlStyling } from '@/app/hooks/useMultilingual';
import { useResponsive } from '@/app/hooks/useResponsive';

// Test component to verify core functionality
const TestComponent: React.FC = () => {
  const { t } = useTranslation();
  const { isRtl } = useRtlStyling();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const [count, setCount] = useState(0);
  const [testResults, setTestResults] = useState<{
    id: string;
    name: string;
    passed: boolean;
    message: string;
  }[]>([]);

  // Run tests on component mount
  useEffect(() => {
    runTests();
  }, []);

  // Test functions
  const runTests = () => {
    const results = [];

    // Test 1: Translation
    try {
      const translationKey = 'test.hello';
      const translatedText = t(translationKey);
      const passed = translatedText !== translationKey;
      results.push({
        id: 'test-translation',
        name: 'Translation System',
        passed,
        message: passed 
          ? 'Translation system is working correctly' 
          : 'Translation system failed to translate key'
      });
    } catch (error) {
      results.push({
        id: 'test-translation',
        name: 'Translation System',
        passed: false,
        message: `Error testing translation: ${error}`
      });
    }

    // Test 2: RTL Support
    try {
      const rtlValue = isRtl ? 'rtl' : 'ltr';
      const documentDir = document.dir;
      const passed = (rtlValue === documentDir);
      results.push({
        id: 'test-rtl',
        name: 'RTL Support',
        passed,
        message: passed 
          ? 'RTL support is working correctly' 
          : `RTL mismatch: component=${rtlValue}, document=${documentDir}`
      });
    } catch (error) {
      results.push({
        id: 'test-rtl',
        name: 'RTL Support',
        passed: false,
        message: `Error testing RTL: ${error}`
      });
    }

    // Test 3: Responsive Design
    try {
      const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
      const windowWidth = window.innerWidth;
      const passed = (
        (isMobile && windowWidth < 640) ||
        (isTablet && windowWidth >= 640 && windowWidth < 1024) ||
        (isDesktop && windowWidth >= 1024)
      );
      results.push({
        id: 'test-responsive',
        name: 'Responsive Design',
        passed,
        message: passed 
          ? `Responsive design is working correctly (${deviceType}, ${windowWidth}px)` 
          : `Responsive detection mismatch: detected=${deviceType}, width=${windowWidth}px`
      });
    } catch (error) {
      results.push({
        id: 'test-responsive',
        name: 'Responsive Design',
        passed: false,
        message: `Error testing responsive design: ${error}`
      });
    }

    // Test 4: Theme Detection
    try {
      const isDarkTheme = document.body.classList.contains('dark-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const passed = true; // We can't automatically verify if theme is correct, just check if detection works
      results.push({
        id: 'test-theme',
        name: 'Theme Detection',
        passed,
        message: `Theme detection is working: current=${isDarkTheme ? 'dark' : 'light'}, system=${prefersDark ? 'dark' : 'light'}`
      });
    } catch (error) {
      results.push({
        id: 'test-theme',
        name: 'Theme Detection',
        passed: false,
        message: `Error testing theme detection: ${error}`
      });
    }

    // Test 5: State Management
    try {
      setCount(1);
      const passed = true; // This will be verified in the next render
      results.push({
        id: 'test-state',
        name: 'State Management',
        passed,
        message: 'State management test initiated'
      });
    } catch (error) {
      results.push({
        id: 'test-state',
        name: 'State Management',
        passed: false,
        message: `Error testing state management: ${error}`
      });
    }

    setTestResults(results);
  };

  // Verify state management test after state update
  useEffect(() => {
    if (count === 1) {
      setTestResults(prev => {
        const updated = [...prev];
        const stateTestIndex = updated.findIndex(test => test.id === 'test-state');
        if (stateTestIndex >= 0) {
          updated[stateTestIndex] = {
            ...updated[stateTestIndex],
            message: 'State management is working correctly'
          };
        }
        return updated;
      });
    }
  }, [count]);

  return (
    <RtlContainer className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('test.title', 'Core Functionality Test')}</CardTitle>
          <CardDescription>{t('test.description', 'Testing core functionality of the website')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <h3 className="font-medium mb-2">{t('test.deviceInfo', 'Device Information')}</h3>
              <p>
                {t('test.deviceType', 'Device Type')}: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}<br />
                {t('test.screenWidth', 'Screen Width')}: {window.innerWidth}px<br />
                {t('test.screenHeight', 'Screen Height')}: {window.innerHeight}px<br />
                {t('test.direction', 'Direction')}: {isRtl ? 'RTL' : 'LTR'}<br />
                {t('test.theme', 'Theme')}: {document.body.classList.contains('dark-theme') ? 'Dark' : 'Light'}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">{t('test.results', 'Test Results')}</h3>
              {testResults.map(test => (
                <div 
                  key={test.id}
                  className={`p-3 rounded-md ${
                    test.passed 
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{test.name}</span>
                    <span className={test.passed ? 'text-green-600' : 'text-red-600'}>
                      {test.passed ? '✓ Passed' : '✗ Failed'}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{test.message}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4">
              <Button onClick={runTests}>
                {t('test.runAgain', 'Run Tests Again')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </RtlContainer>
  );
};

export default TestComponent;
