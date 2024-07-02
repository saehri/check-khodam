import {NextRequest, NextResponse} from 'next/server';

const AUTH_COOKIE = 'auth';

export function middleware(req: NextRequest) {
  if (!req.cookies.has(AUTH_COOKIE)) {
    return NextResponse.json(
      {success: false, message: 'User not authenticated'},
      {status: 401}
    );
  }

  const authCookie = req.cookies.get(AUTH_COOKIE)?.value;
  if (!authCookie) {
    return NextResponse.json(
      {success: false, message: 'User not authenticated'},
      {status: 401}
    );
  }

  let credentials;
  try {
    credentials = JSON.parse(authCookie);
  } catch (e) {
    return NextResponse.json(
      {success: false, message: 'Invalid authentication token'},
      {status: 401}
    );
  }

  const {username, password} = credentials;

  const isUsernameValid = username === process.env.USER_USERNAME;
  const isPasswordValid = password === process.env.USER_PASSWORD;

  if (!isUsernameValid || !isPasswordValid) {
    return NextResponse.json(
      {success: false, message: 'Invalid username or password'},
      {status: 401}
    );
  }

  // If authentication is successful, continue to the next middleware or request handler
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/khodam/new'],
};
