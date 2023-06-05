const { RC4, shiftCipherDecrypt, shiftCipherEncrypt } = require("./src/encryption.js");
const { randChar } = require("./src/utils.js");
const { hideTextInImage, extractTextFromImage } = require("./src/lsb.js");

function encrypt(plaintext) {
	// random shift
	let shift = Math.floor(Math.random() * 20) + 1;
	// random secret key
	let keyLength = Math.floor(Math.random() * (50 - 21 + 1)) + 21;
	let key = randChar(keyLength);
	// encrypt with RC4
	let RC4Encrypted = RC4(key, plaintext);
	// encrypt with shift
	let ciphertext = shiftCipherEncrypt(RC4Encrypted, shift);
	return btoa(JSON.stringify({ c: ciphertext, s: keyLength - shift, k: key }));
}

function decrypt(cipher) {
	// decrypt with shift
	let { c: ciphertext, k: key, s } = JSON.parse(atob(cipher));
	let shift = key.length - s;

	let ShiftDecrypted = shiftCipherDecrypt(ciphertext, shift);

	// decrypt with RC4
	let plaintext = RC4(key, ShiftDecrypted);

	return plaintext;
}

async function hide(base64Image, plaintext) {
	const cipher = encrypt(plaintext);
	return hideTextInImage(base64Image, cipher);
}

async function extract(base64Image) {
	const decrypted = await extractTextFromImage(base64Image);
	return decrypt(decrypted);
}

module.exports = {
	encrypt,
	decrypt,
	hide,
	extract,
};
