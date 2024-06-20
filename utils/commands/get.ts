import { db } from '@/lib/db';

export async function handleGet(userId: string, command: string) {
  const [, key] = command.split(' ');
  const result = await db.command.findMany({
    where: { userId, command: { startsWith: `set ${key}` } },
    orderBy: { timestamp: 'desc' },
  });
  if (result.length === 0) {
    return 'nil';
  }
  const lastSetCommand = result[0].command.split(' ');
  const value = lastSetCommand.slice(2).join(' ');
  return `Value: ${value}`;
}
