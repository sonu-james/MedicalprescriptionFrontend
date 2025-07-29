import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
      userPoolId: import.meta.env.VITE_USER_POOL_ID || 'ap-south-1_U2u0qXuEK',
      userPoolClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID || '5sjuf1atk9mi8ufregrsgskkdu',
      loginWith: {
        email: true,
      },
    }
  }
};

Amplify.configure(awsConfig);

export default awsConfig;