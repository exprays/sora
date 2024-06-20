import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { useUser } from '@clerk/nextjs';

export default function Console() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (terminalRef.current && user) {
      const term = new Terminal();
      term.open(terminalRef.current);

      const fetchCommands = async () => {
        const res = await fetch(`/api/commands`);
        const commands = await res.json();
        commands.forEach((cmd: { command: string; output: string }) => {
          term.writeln(`> ${cmd.command}`);
          term.writeln(cmd.output);
        });
      };

      fetchCommands();

      term.onKey(async ({ key, domEvent }) => {
        if (domEvent.keyCode === 13) {
          const command = term.buffer.active?.getLine(term.buffer.active.baseY)?.translateToString();
          const res = await fetch('/api/commands', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command }),
          });
          const { output } = await res.json();
          term.writeln(output);
        } else {
          term.write(key);
        }
      });
    }
  }, [user]);

  return <div ref={terminalRef} style={{ height: '100%', width: '100%' }} />;
}
