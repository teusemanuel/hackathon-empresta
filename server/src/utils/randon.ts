import * as crypto from "crypto";

export class Randon {
	static possibleText = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	static possibleNumbers = "0123456789";
	static generateSMSVerificationCode(size: number, type: "number" | "text"): string {
		const possible = type === "text" ? Randon.possibleText : Randon.possibleNumbers;
		let value = "";
		for (let i = 0; i < size; i++) {
			value += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return value;
	}

	static encrypt(text: string): string {
		const key = Buffer.from(process.env.JWT_ID_KEY || "", "hex");
		const iv = Buffer.from(process.env.JWT_ID_IV || "", "hex");

		const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
		let encrypted = cipher.update(text);
		encrypted = Buffer.concat([encrypted, cipher.final()]);

		return encrypted.toString("hex");
	}

	static decrypt(data: string): string {
		const key = Buffer.from(process.env.JWT_ID_KEY || "", "hex");
		const iv = Buffer.from(process.env.JWT_ID_IV || "", "hex");

		const encryptedText = Buffer.from(data, "hex");
		const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
		let decrypted = decipher.update(encryptedText);
		decrypted = Buffer.concat([decrypted, decipher.final()]);

		return decrypted.toString();
	}
}
