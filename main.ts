import { spawn } from 'child_process';

const serverService = spawn('ts-node', ['./task19/serverService.ts']);

serverService.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

serverService.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

serverService.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
