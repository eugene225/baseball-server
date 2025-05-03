import admin from 'firebase-admin';
import * as fs from 'fs';

const rawData = fs.readFileSync(new URL('../../src/configs/serviceAccountKey.json', import.meta.url), 'utf-8');

const serviceAccount = JSON.parse(rawData);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;