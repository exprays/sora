import { db } from '@/lib/db';

export async function handleIncr(userId: string, command: string) {
  const [, key] = command.split(' ');
  const result = await db.command.findMany({
    where: { userId, command: { startsWith: `set ${key}` } },
    orderBy: { timestamp: 'desc' },
  });
  let value = 0;
  if (result.length > 0) {
    const lastSetCommand = result[0].command.split(' ');
    value = parseInt(lastSetCommand[lastSetCommand.length - 1], 10);
  }
  value += 1;
  await db.command.create({
    data: { userId, command, output: `OK: ${key} = ${value}` },
  });
  return `OK: ${key} = ${value}`;
}
