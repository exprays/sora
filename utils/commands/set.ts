import { db } from '@/lib/db';

export async function handleSet(userId: string, command: string) {
  const [, key, value] = command.split(' ');
  await db.command.create({
    data: { userId, command, output: `OK: ${key} = ${value}` },
  });
  return `OK: ${key} = ${value}`;
}
