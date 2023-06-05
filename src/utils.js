function randChar(length = 10) {
	let text = "";
	const unicodeRangeStart = 32; // Start of Unicode printable characters
	const unicodeRangeEnd = 126; // End of Unicode printable characters

	for (let i = 0; i < length; i++) {
		const randomUnicode = Math.floor(Math.random() * (unicodeRangeEnd - unicodeRangeStart + 1)) + unicodeRangeStart;
		text += String.fromCharCode(randomUnicode);
	}

	return text;
}

module.exports = { randChar };
