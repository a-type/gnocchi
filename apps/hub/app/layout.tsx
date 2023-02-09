export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head>
				<noscript id="__next_css__DO_NOT_USE__"></noscript>
			</head>
			<body>{children}</body>
		</html>
	);
}
