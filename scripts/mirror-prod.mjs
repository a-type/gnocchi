import * as prompt from '@clack/prompts';
import * as fs from 'fs';

prompt.intro('Gnocchi data mirroring');

// read directories in ./backups
const backups = fs.readdirSync('./backups').filter((f) => f !== '.gitkeep');

// prompt for which backup to use
const backup = await prompt.select({
	message: 'Which backup?',
	options: [
		...backups.map((b) => ({
			value: b,
			label: b,
		})),
		{ value: 'restore', label: 'Restore before last backup' },
	],
	maxItems: 10,
});

if (prompt.isCancel(backup)) {
	console.log('Cool.');
	process.exit(0);
}

if (backup === 'restore') {
	// restore the backup
	console.log('Restoring backup...');
	const lastBackup = backups[backups.length - 1];
	fs.copyFileSync(`./apps/api/storage.sqlite.bak`, './apps/api/storage.sqlite');
	fs.copyFileSync(
		`./packages/prisma/prisma/db.sqlite.bak`,
		'./packages/prisma/prisma/db.sqlite',
	);
	fs.rmSync(`./apps/api/storage.sqlite.bak`);
	fs.rmSync(`./packages/prisma/prisma/db.sqlite.bak`);
	console.log('Done.');
	process.exit(0);
}

// make a backup of the current databases
if (fs.existsSync('./apps/api/storage.sqlite')) {
	fs.copyFileSync('./apps/api/storage.sqlite', './apps/api/storage.sqlite.bak');
}
if (fs.existsSync('./packages/prisma/prisma/db.sqlite')) {
	fs.copyFileSync(
		'./packages/prisma/prisma/db.sqlite',
		'./packages/prisma/prisma/db.sqlite.bak',
	);
}
fs.copyFileSync(
	`./backups/${backup}/backup-verdant.db`,
	'./apps/api/storage.sqlite',
);
fs.copyFileSync(
	`./backups/${backup}/backup.db`,
	'./packages/prisma/prisma/db.sqlite',
);
prompt.outro('Done.');
