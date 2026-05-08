const getApiUrl = () => {
  const configuredUrl = process.env.REACT_APP_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5000/api';
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api`;
  }

  return '/api';
};

export default getApiUrl;