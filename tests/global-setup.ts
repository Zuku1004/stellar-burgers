import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const baseURL = 'http://127.0.0.1:4000';
const pidFilePath = path.join(process.cwd(), 'test-results', 'dev-server.pid');

const isServerReady = async () => {
  try {
    const response = await fetch(baseURL);
    return response.ok;
  } catch {
    return false;
  }
};

const waitForServer = async () => {
  const timeout = Date.now() + 120000;

  while (Date.now() < timeout) {
    if (await isServerReady()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Dev server did not start in time');
};

export default async function globalSetup() {
  fs.mkdirSync(path.dirname(pidFilePath), { recursive: true });

  if (await isServerReady()) {
    fs.rmSync(pidFilePath, { force: true });
    return;
  }

  const server = spawn(
    process.execPath,
    [
      './node_modules/webpack-dev-server/bin/webpack-dev-server.js',
      '--mode=development',
      '--no-open'
    ],
    {
      cwd: process.cwd(),
      detached: true,
      stdio: 'ignore',
      windowsHide: true
    }
  );

  fs.writeFileSync(pidFilePath, String(server.pid));
  server.unref();

  await waitForServer();
}
