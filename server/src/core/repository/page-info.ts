import {autoserialize} from "cerialize";
import {Property} from "@tsed/schema";

export class PageInfo {
	@autoserialize
	@Property()
	length: number;

	@autoserialize
	@Property()
	pageIndex: number;

	@autoserialize
	@Property()
	pageSize: number;
}
