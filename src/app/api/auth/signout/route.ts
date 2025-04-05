import { NextResponse } from 'next/server';

export async function POST() {
  // We don't need to manually sign out here,
  // NextAuth handles this via client-side signOut function
  return NextResponse.json({ success: true });
} 