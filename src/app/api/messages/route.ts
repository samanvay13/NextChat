import { prisma } from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role, content } = await req.json();

    if (!role || !content) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    // Save message to database
    await prisma.message.create({
      data: { role, content },
    });

    // Fetch the last message from the database
    const lastMessage = await prisma.message.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(lastMessage);
  } catch (error) {
    console.error('Error saving message:', error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
