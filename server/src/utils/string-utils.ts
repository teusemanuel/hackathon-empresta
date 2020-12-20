export class StringUtils {
	static AUTH_HEADER = /(\S+)\s+(\S+)/;

	static onlyDigits(value: string): string | null {
		return !value ? null : value.replace(/\D/g, "");
	}

	static onlyDigitsNumber(value: string): number | null {
		const digits = StringUtils.onlyDigits(value);

		return digits ? +digits : null;
	}

	static getTokenFromAuthHeader(headerBearer: string): { scheme: string; value: string } | null {
		const matches = headerBearer.match(StringUtils.AUTH_HEADER);
		return matches && { scheme: matches[1], value: matches[2] };
	}
}
