#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const geminiConfigPath = join(projectRoot, '.gemini', 'commands.yaml');
const codexDir = join(projectRoot, '.codex');
const codexConfigPath = join(codexDir, 'codex.toml');

function formatPromptForToml(prompt) {
  const safe = prompt.replace(/"""/g, '\\"""');
  return `"""\n${safe}\n"""`;
}

function toToml(commands) {
  const header = [
    '# Auto-generated from .gemini/commands.yaml',
    '# Run `npm run sync:commands` after editing Gemini slash commands.',
    '',
  ];

  const blocks = Object.keys(commands)
    .sort()
    .map((name) => {
      const command = commands[name];
      if (!command || typeof command.prompt !== 'string') {
        throw new Error(`Command "${name}" is missing a prompt.`);
      }
      const promptBlock = formatPromptForToml(command.prompt);
      return `[commands."${name}"]\nprompt = ${promptBlock}\n`;
    });

  return header.concat(blocks).join('\n');
}

function main() {
  const geminiRaw = readFileSync(geminiConfigPath, 'utf8');
  const parsed = parse(geminiRaw);
  if (!parsed || typeof parsed !== 'object' || !parsed.commands) {
    throw new Error('Invalid .gemini/commands.yaml format.');
  }

  mkdirSync(codexDir, { recursive: true });
  const toml = toToml(parsed.commands);
  writeFileSync(codexConfigPath, toml, 'utf8');
  console.log(`Synced ${Object.keys(parsed.commands).length} command(s) to ${codexConfigPath}`);
}

main();
