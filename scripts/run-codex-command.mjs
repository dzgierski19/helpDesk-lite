#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const commandsPath = join(projectRoot, '.gemini', 'commands.yaml');
const logsDir = join(projectRoot, 'notes', 'llm');

const commandName = process.argv[2];

if (!commandName) {
  console.error('Usage: npm run codex -- <command-name>');
  process.exit(1);
}

const raw = readFileSync(commandsPath, 'utf8');
const parsed = parse(raw);
const command = parsed?.commands?.[commandName];

if (!command || typeof command.prompt !== 'string') {
  console.error(`Command "${commandName}" not found in .gemini/commands.yaml`);
  process.exit(1);
}

const prompt = command.prompt.trim();
const result = spawnSync('codex', ['exec', prompt], {
  encoding: 'utf8',
});

const stdout = result.stdout ?? '';
const stderr = result.stderr ?? '';
process.stdout.write(stdout);
process.stderr.write(stderr);

const timestamp = new Date();
const safeTimestamp = timestamp.toISOString().replace(/[:]/g, '-');
const logFilename = `${commandName.replace(/[^a-zA-Z0-9-_]/g, '_')}-${safeTimestamp}.md`;
mkdirSync(logsDir, { recursive: true });
const logPath = join(logsDir, logFilename);

const md = [
  `# ${commandName} – ${timestamp.toISOString()}`,
  '',
  `**Command:** \`npm run codex -- ${commandName}\``,
  `**Exit status:** ${result.status ?? 'unknown'}`,
  '',
  '## Prompt',
  '',
  '```',
  prompt,
  '```',
  '',
  '## Output',
  '',
  '```',
  (stdout + stderr).trimEnd(),
  '```',
  '',
].join('\n');

writeFileSync(logPath, md, 'utf8');
console.log(`\nSaved log to ${relative(projectRoot, logPath)}`);

if (result.error) {
  console.error(`Failed to run Codex: ${result.error.message}`);
  process.exit(result.status ?? 1);
}

process.exit(result.status ?? 0);
