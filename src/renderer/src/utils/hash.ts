import hash from 'hash.js';

export const getHashedString = (str: string): string => hash.sha256().update(str).digest('hex');
