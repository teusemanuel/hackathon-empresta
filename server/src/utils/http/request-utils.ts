import { Request } from "@tsed/common";

export function ipFromRequest(req: Request): string {
	let ip = (req.headers["x-forwarded-for"] as string) || req.connection.remoteAddress || req.socket.remoteAddress; // || req.connection.socket.remoteAddress;
	if (!ip) {
		return "";
	}

	ip = ip.split(",")[0];
	ip = ip.split(":").slice(-1).toString();

	return ip;
}
