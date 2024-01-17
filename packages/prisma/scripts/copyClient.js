import * as fs from 'fs';

// copy ./src/.generated dir to ./dist/esm/.generated

const srcDir = './src/.generated';
const destDir = './dist/esm/.generated';

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
