const getApiUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  // If no URL, in development stick to localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }

  // In production, when using Vercel serverless functions, the API is available locally on the same domain at /api
  return '/api';
};

export default getApiUrl;