const { google } = require('googleapis');

function getGoogleAuthURL(oAuthData) {
  /*
   * Generate a url that asks permissions to the user's email and profile
   */
  const oauth2Client = new google.auth.OAuth2(oAuthData);
  const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes, // If you only need one scope you can pass it as string
  });
}

exports.googleOauthLink = (req, res) => {
  const oAuthData = {};

  oAuthData.clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
  oAuthData.clientSecret = process.env.GOOGLE_AUTH_SECRET;
  oAuthData.redirectUri = process.env.GOOGLE_AUTH_REDIRECT_URI;

  console.log('OAUTHDATA', oAuthData);
  try {
    const link = getGoogleAuthURL(oAuthData);
    console.log('google link creado', link);
    return {
      OK: 1,
      link,
    };
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return {
      OK: 0,
      error,
    };
  }
};
