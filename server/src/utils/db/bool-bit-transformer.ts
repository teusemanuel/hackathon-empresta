import { ValueTransformer } from "typeorm";

export class BoolBitTransformer implements ValueTransformer {
	// To db from typeorm
	to(value?: boolean): number | undefined {
		if (value === null) {
			return;
		}
		// const res = new Buffer(1);
		// res[0] = value ? 1 : 0;
		// return res;
		return value ? 1 : 0;
	}
	// From db to typeorm
	from(value: number): boolean | undefined {
		if (value === null) {
			return;
		}
		return value === 1;
	}
}
