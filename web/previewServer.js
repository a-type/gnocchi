import express from 'express';

const app = express();

// just serves files from ./dist,
// but also adds headers Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp
// so web SQLite can load

app.use(
	express.static('./dist', {
		setHeaders: (res, path) => {
			res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
			res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
		},
	}),
);

app.listen(8081, () => {
	console.log('Preview server listening on port 8081');
});
