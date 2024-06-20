import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!user || !userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { command } = await req.json();
    let output;

    if (command.startsWith('set')) {
      const { handleSet } = await import('@/utils/commands/set');
      output = await handleSet(userId, command);
    } else if (command.startsWith('get')) {
      const { handleGet } = await import('@/utils/commands/get');
      output = await handleGet(userId, command);
    } else if (command.startsWith('incr')) {
      const { handleIncr } = await import('@/utils/commands/incr');
      output = await handleIncr(userId, command);
    } else if (command.startsWith('incrby')) {
      const { handleIncrby } = await import('@/utils/commands/incrby');
      output = await handleIncrby(userId, command);
    } else {
      output = 'Unknown command';
    }

    return NextResponse.json({ output });
  } catch (error) {
    console.log('[COMMANDS_POST_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const commands = await db.command.findMany({
      where: { userId },
      orderBy: { timestamp: 'asc' },
    });

    return NextResponse.json(commands);
  } catch (error) {
    console.log('[COMMANDS_GET_ERROR]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
