const Jimp = require("jimp");

// Function to hide a message in an image using LSB
async function hideTextInImage(base64Img, message) {
	const base64Image = base64Img.replace(/^data:image\/png;base64,/, "");
	const image = await Jimp.read(Buffer.from(base64Image, "base64"));

	const binaryMessage = messageToBinary(message);

	// Check if the message can fit in the image
	if (binaryMessage.length > image.bitmap.width * image.bitmap.height) {
		throw new Error("Message is too large to hide in the image.");
	}

	// Hide the message in the LSB of each pixel
	let binaryIndex = 0;
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		const pixelValue = this.bitmap.data[idx];
		const newPixelValue = (pixelValue & 0xfe) | binaryMessage[binaryIndex];
		this.bitmap.data[idx] = newPixelValue;
		binaryIndex++;
	});

	// Save the modified image

	return await image.getBase64Async(Jimp.MIME_PNG);
}

// Function to extract a hidden message from an image using LSB
async function extractTextFromImage(base64Img) {
	const base64Image = base64Img.replace(/^data:image\/png;base64,/, "");

	const image = await Jimp.read(Buffer.from(base64Image, "base64"));
	const binaryMessage = [];

	// Extract the LSB from each pixel
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		const pixelValue = this.bitmap.data[idx];
		const lsb = pixelValue & 1;
		binaryMessage.push(lsb);
	});

	const message = binaryToMessage(binaryMessage.join(""));
	return message;
}

// Helper function to convert a message to binary
function messageToBinary(message) {
	return message
		.split("")
		.map((char) => {
			const binary = char.charCodeAt(0).toString(2);
			return "0".repeat(8 - binary.length) + binary;
		})
		.join("");
}

// Helper function to convert binary to a message
function binaryToMessage(binary) {
	let message = "";
	for (let i = 0; i < binary.length; i += 8) {
		const byte = binary.substr(i, 8);
		message += String.fromCharCode(parseInt(byte, 2));
	}
	return message.replace(/\0/g, "");
}

module.exports = { hideTextInImage, extractTextFromImage };
