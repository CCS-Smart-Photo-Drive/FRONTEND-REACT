const IS_DEV = import.meta.env.MODE === 'development';

//todo put api here
export const API_URL = IS_DEV ? 'http://localhost:5000' : 'https://example.com';