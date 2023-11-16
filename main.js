import fs from 'fs-extra';
import SftpClient from 'ssh2-sftp-client';
import 'dotenv/config';
import { LOCAL_FOLDER_PATH, REMOTE_FOLDER_PATH, REMOTE_HOST, REMOTE_PASSWORD, REMOTE_PORT, REMOTE_USERNAME } from './constants.js'

main()

async function main() {
  await fs.ensureDir(LOCAL_FOLDER_PATH);

  const client = new SftpClient();

  try {
    console.log('Connecting...')

    await client.connect({
      host: REMOTE_HOST,
      port: REMOTE_PORT,
      username: REMOTE_USERNAME,
      password: REMOTE_PASSWORD
    })


    console.log('Downloading...')
    await client.downloadDir(REMOTE_FOLDER_PATH, LOCAL_FOLDER_PATH, {
      filter: (path) => {
        const dirs = ['database', 'site']

        return dirs.some((item) => path.includes(item))
      }
    });

    console.log('Download Complete!')
    await client.end();
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}