import jwtDecode from 'jwt-decode';

interface JwtPayload {
  exp: number; // expiration time (in seconds)
  roles: string[];
  name: string;
  email: string;
  // Add any other claims your token includes
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Token decoding failed", error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  // Compare expiration time (in seconds) with current time (in seconds)
  return decoded.exp < Date.now() / 1000;
}
