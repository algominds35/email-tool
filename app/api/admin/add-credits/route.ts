import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const authResult = await auth();
  
  if (!authResult.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { credits } = await request.json();
    
    const user = await prisma.user.update({
      where: { clerkId: authResult.userId },
      data: {
        emailCredits: {
          increment: credits || 1000
        }
      }
    });

    return NextResponse.json({ 
      message: 'Credits added successfully',
      newBalance: user.emailCredits 
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 });
  }
}

