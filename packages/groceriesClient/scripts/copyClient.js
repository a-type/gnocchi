import * as fs from 'fs';

// copy ./src/client dir to ./dist/esm/client

const srcDir = './src/client';
const destDir = './dist/esm/client';

const copyDir = (src, dest) => {
	fs.mkdirSync(dest, { recursive: true });
	const files = fs.readdirSync(src);
	files.forEach((file) => {
		const srcFile = `${src}/${file}`;
		const destFile = `${dest}/${file}`;
		if (fs.lstatSync(srcFile).isDirectory()) {
			copyDir(srcFile, destFile);
		} else {
			fs.copyFileSync(srcFile, destFile);
		}
	});
};

copyDir(srcDir, destDir);
