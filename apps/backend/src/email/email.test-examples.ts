/**
 * Email Service Test Examples
 * 
 * This file contains example code for testing email functionality.
 * These are NOT actual tests but examples of how to use the email service.
 * 
 * To test emails in real-time:
 * 1. Configure your email provider in .env.local
 * 2. Start the backend server
 * 3. Use the API endpoints or run these examples
 */

import { EmailService } from './email.service';

/**
 * Example 1: Test User Registration Verification Email
 * 
 * This simulates sending a verification email after user registration.
 */
export async function testVerificationEmail(emailService: EmailService) {
  const result = await emailService.sendVerificationEmail(
    'test@example.com',
    'verification-token-12345',
    'John Doe'
  );

  console.log('Verification Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 2: Test Password Reset Email
 * 
 * This simulates sending a password reset email.
 */
export async function testPasswordResetEmail(emailService: EmailService) {
  const result = await emailService.sendPasswordResetEmail(
    'test@example.com',
    'reset-token-12345',
    'John Doe'
  );

  console.log('Password Reset Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 3: Test Emergency Alert Email
 * 
 * This simulates sending an emergency alert to neighborhood members.
 */
export async function testEmergencyAlertEmail(emailService: EmailService) {
  const result = await emailService.sendEmergencyAlertEmail(
    'test@example.com',
    'Power Outage Scheduled',
    'Kenya Power has scheduled a power outage in Westlands area from 9 AM to 5 PM tomorrow for maintenance work.',
    'POWER_OUTAGE',
    'Westlands'
  );

  console.log('Emergency Alert Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 4: Test Job Application Email
 * 
 * This simulates sending a job application notification to an employer.
 */
export async function testJobApplicationEmail(emailService: EmailService) {
  const result = await emailService.sendJobApplicationEmail(
    'employer@example.com',
    'Jane Smith',
    'Software Developer Position',
    'I am very interested in this position and have 5 years of experience in software development...'
  );

  console.log('Job Application Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 5: Test Service Booking Email
 * 
 * This simulates sending a service booking notification to a service provider.
 */
export async function testServiceBookingEmail(emailService: EmailService) {
  const result = await emailService.sendServiceBookingEmail(
    'provider@example.com',
    'Plumbing Services',
    'John Doe',
    'I need help fixing a leaking pipe in my kitchen. It\'s urgent!',
    '2024-12-20',
    '10:00'
  );

  console.log('Service Booking Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 6: Test Marketplace Update Email
 * 
 * This simulates sending a marketplace update when someone buys an item.
 */
export async function testMarketplaceUpdateEmail(emailService: EmailService) {
  const result = await emailService.sendMarketplaceUpdateEmail(
    'seller@example.com',
    'Vintage Coffee Table',
    'purchase',
    'Jane Buyer',
    'I\'m interested in purchasing this item. When can I pick it up?'
  );

  console.log('Marketplace Update Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 7: Test Message Notification Email
 * 
 * This simulates sending a message notification email.
 */
export async function testMessageNotificationEmail(emailService: EmailService) {
  const result = await emailService.sendMessageNotificationEmail(
    'recipient@example.com',
    'John Sender',
    'Hi! I saw your listing and I\'m very interested. Is it still available?',
    '/messages/conversation-123'
  );

  console.log('Message Notification Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 8: Test Generic Notification Email
 * 
 * This simulates sending a generic notification email.
 */
export async function testNotificationEmail(emailService: EmailService) {
  const result = await emailService.sendNotificationEmail(
    'user@example.com',
    'New Neighborhood Event',
    'A new community event has been scheduled in your neighborhood. Check it out!',
    'info',
    '/events/event-123',
    'View Event'
  );

  console.log('Notification Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Example 9: Test Async Email Sending
 * 
 * This demonstrates the async email sending wrapper.
 */
export async function testAsyncEmailSending(emailService: EmailService) {
  // This sends email in background without blocking
  emailService.sendEmailAsync(
    () => emailService.sendVerificationEmail(
      'test@example.com',
      'token-123',
      'Test User'
    ),
    'Test Async Email'
  );

  console.log('Email queued for sending (non-blocking)');
  // The email will be sent in the background
}

/**
 * Example 10: Test Custom Email
 * 
 * This demonstrates sending a custom email with full control.
 */
export async function testCustomEmail(emailService: EmailService) {
  const result = await emailService.sendEmail({
    to: 'recipient@example.com',
    subject: 'Custom Email from MTAA',
    html: `
      <h1>Hello!</h1>
      <p>This is a custom email sent from the MTAA platform.</p>
      <p>You can customize the HTML content as needed.</p>
    `,
    text: 'Hello! This is a custom email sent from the MTAA platform.',
  });

  console.log('Custom Email Result:', result);
  // Expected: { success: true, messageId: '...' }
}

/**
 * Real-Time Testing Guide
 * 
 * To test emails in real-time:
 * 
 * 1. Configure email provider in .env.local:
 *    EMAIL_SERVICE=sendgrid
 *    EMAIL_SERVICE_API_KEY=your_key
 *    EMAIL_FROM_ADDRESS=noreply@mymtaa.com
 * 
 * 2. Start backend server:
 *    npm run dev
 * 
 * 3. Test via API:
 *    - Register user: POST /api/v1/auth/register
 *    - Request password reset: POST /api/v1/auth/forgot-password
 *    - Create emergency alert: POST /api/v1/posts (type: SAFETY_ALERT)
 *    - Apply for job: POST /api/v1/jobs/:id/apply
 *    - Book service: POST /api/v1/services/:id/book
 * 
 * 4. Check email inbox for received emails
 * 
 * 5. Check backend logs for email sending status
 */

