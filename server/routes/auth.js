const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Get Google OAuth URL
router.get('/google/connect', protect, (req, res) => {
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
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  console.log('Received callback with code:', code, 'and state:', state);

  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Got tokens:', tokens);
    oauth2Client.setCredentials(tokens);

    // Get user's email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();
    console.log('Got user info:', data);

    // Update user with Google credentials
    const updatedUser = await User.findByIdAndUpdate(
      state,
      {
        'googleAuth.accessToken': tokens.access_token,
        'googleAuth.refreshToken': tokens.refresh_token,
        'googleAuth.email': data.email
      },
      { new: true }
    );

    if (!updatedUser) {
      console.error('User not found with ID:', state);
      throw new Error('User not found');
    }

    console.log('Updated user:', updatedUser);

    // Close the popup window
    res.send(`
      <script>
        window.opener.postMessage({ type: 'oauth-callback', success: true }, '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).send(`
      <script>
        window.opener.postMessage({ type: 'oauth-callback', success: false, error: '${error.message}' }, '*');
        window.close();
      </script>
    `);
  }
});

// Disconnect Google account
router.post('/google/disconnect', protect, async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { googleAuth: 1 } },
      { new: true }
    );
    
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Google account disconnected' });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ message: 'Failed to disconnect Google account' });
  }
});

// Get connected accounts
router.get('/connected-accounts', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const accounts = [
      {
        provider: 'Google Calendar',
        connected: !!user.googleAuth?.accessToken,
        email: user.googleAuth?.email
      }
    ];
    res.json(accounts);
  } catch (error) {
    console.error('Fetch accounts error:', error);
    res.status(500).json({ message: 'Failed to fetch connected accounts' });
  }
});

module.exports = router; 