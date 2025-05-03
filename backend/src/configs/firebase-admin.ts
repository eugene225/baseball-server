import admin from 'firebase-admin';
import serviceAccountRaw from './serviceAccountKey.json' with { type: 'json' };

const serviceAccount = {
  ...serviceAccountRaw,
  private_key: process.platform === 'linux' ? serviceAccountRaw.private_key : serviceAccountRaw.private_key.replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;