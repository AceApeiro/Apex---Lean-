import Tesseract from 'tesseract.js';

async function readImage() {
  try {
    const { data: { text } } = await Tesseract.recognize(
      'https://i.imgur.com/X7qnOCn.png',
      'eng',
      { logger: m => console.log(m) }
    );
    console.log('--- TEXT ---');
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}

readImage();
