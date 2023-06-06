function RC4(key, plaintext) {
	// RC4 Encryption and Decryption
	let keyLength = key.length;
	let S = [];
	let ciphertext = "";

	for (let i = 0; i < 256; i++) {
		S[i] = i;
	}

	let j = 0;
	for (let i = 0; i < 256; i++) {
		j = (j + S[i] + key.charCodeAt(i % keyLength)) % 256;
		[S[i], S[j]] = [S[j], S[i]];
	}

	let i = 0;
	j = 0;
	for (let k = 0; k < plaintext.length; k++) {
		i = (i + 1) % 256;
		j = (j + S[i]) % 256;
		[S[i], S[j]] = [S[j], S[i]];
		let t = (S[i] + S[j]) % 256;
		let u = S[t];
		ciphertext += String.fromCharCode(plaintext.charCodeAt(k) ^ u);
	}

	return ciphertext;
}

function shiftCipherEncrypt(plaintext, shift) {
	// Shift Cipher Encryption
	var ciphertext = "";
	for (var i = 0; i < plaintext.length; i++) {
		var charCode = plaintext.charCodeAt(i);
		ciphertext += String.fromCharCode((charCode + shift) % 256);
	}
	return ciphertext;
}

function shiftCipherDecrypt(ciphertext, shift) {
	// Shift Cipher Decryption
	var plaintext = "";
	for (var i = 0; i < ciphertext.length; i++) {
		var charCode = ciphertext.charCodeAt(i);
		plaintext += String.fromCharCode((charCode - shift + 256) % 256);
	}
	return plaintext;
}

module.exports = { RC4, shiftCipherEncrypt, shiftCipherDecrypt };
