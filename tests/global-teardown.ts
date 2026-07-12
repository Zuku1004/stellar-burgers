import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const pidFilePath = path.join(process.cwd(), 'test-results', 'dev-server.pid');

export default async function globalTeardown() {
  if (!fs.existsSync(pidFilePath)) {
    return;
  }

  const pid = fs.readFileSync(pidFilePath, 'utf-8').trim();

  if (pid) {
    spawnSync('taskkill', ['/pid', pid, '/T', '/F'], {
      stdio: 'ignore',
      windowsHide: true
    });
  }

  fs.rmSync(pidFilePath, { force: true });
}
