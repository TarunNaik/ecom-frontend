import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Authorization header missing or invalid' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Token not found' }, { status: 401 });
  }

  // In a real application, you would validate the token and fetch the user from a database.
  // For now, we'll return a mock user if the token is present.
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'buyer',
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  };

  return NextResponse.json(mockUser);
}