import { Capturer } from '@/components/recipes/ocr/Capturer.jsx';
import { useState } from 'react';

export interface TestPageProps {}

export function TestPage({}: TestPageProps) {
	const [text, setText] = useState('');

	return (
		<>
			<Capturer onComplete={setText} />
			<div>{text}</div>
		</>
	);
}

export default TestPage;
