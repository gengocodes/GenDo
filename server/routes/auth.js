const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const User = require('../models/User');
const auth = require('../middleware/auth');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Get Google OAuth URL
router.get('/google/connect', auth, (req, res) => {
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: req.user._id.toString() // Pass user ID in state
  });

  res.json({ authUrl });
});

// Google OAuth callback
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user's email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Update user with Google credentials
    await User.findByIdAndUpdate(state, {
      'googleAuth.accessToken': tokens.access_token,
      'googleAuth.refreshToken': tokens.refresh_token,
      'googleAuth.email': data.email
    });

    // Close the popup window
    res.send(`
      <script>
        window.opener.postMessage({ type: 'oauth-callback', success: true }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Failed to connect Google account' });
  }
});

// Disconnect Google account
router.post('/google/disconnect', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { googleAuth: 1 }
    });
    res.json({ message: 'Google account disconnected' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to disconnect Google account' });
  }
});

// Get connected accounts
router.get('/connected-accounts', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accounts = [
      {
        provider: 'Google Calendar',
        connected: !!user.googleAuth,
        email: user.googleAuth?.email
      }
    ];
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch connected accounts' });
  }
});

module.exports = router; 