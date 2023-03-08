import webPush from 'web-push';
import fs from 'fs';

const vapidKeys = webPush.generateVAPIDKeys();

// write to the end of .env
fs.appendFileSync(
	'.env',
	`\nVAPID_PUBLIC_KEY=${vapidKeys.publicKey}\nVAPID_PRIVATE_KEY=${vapidKeys.privateKey}\n`,
);

console.log('Keys written to .env');
