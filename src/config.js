const IS_DEV = import.meta.env.MODE === 'development';

//todo put api here
export const API_URL = (domain) => IS_DEV ? 'http://localhost:5000' : (
    domain.includes('https://ccssmartdrive.vercel.app/')
    ? 'https://api-smartdrive.ccstiet.com'
    : 'https://api-smartdrive.ccstiet.com'
)

