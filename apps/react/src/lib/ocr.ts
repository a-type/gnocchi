import Tesseract from 'tesseract.js';

export async function ocr(image: string) {
	const {
		data: { text },
	} = await Tesseract.recognize(image, 'eng', {
		logger: (m) => console.log(m),
	});

	console.log('OCR', text);

	return text;
}
