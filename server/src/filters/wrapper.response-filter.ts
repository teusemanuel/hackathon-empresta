import {Context, ResponseFilter, ResponseFilterMethods} from "@tsed/common";
import {$log} from "@tsed/logger";
import {Outcome} from "../core/repository/outcome";
import {ResultModel} from "../core/response/result.model";

@ResponseFilter("*/*")
export class WrapperResponseFilter
	implements ResponseFilterMethods<ResultModel<unknown> | Outcome<unknown> | {length: number} | undefined> {
	transform(
		data: ResultModel<unknown> | Outcome<unknown> | undefined,
		ctx: Context
	): ResultModel<unknown> | Outcome<unknown> | undefined {
		const type = typeof data;

		if (!ctx.getResponse().getHeader("content-type") || ctx.getResponse().getHeader("content-type") === "application/json") {
			$log.debug(`************** OutcomeMiddleware ${JSON.stringify(data)} type ${type} *************`);
		}

		if (ctx.endpoint.statusCode === 204) {
			ctx.getResponse().send();

			return;
		}

		if (data === undefined) {
			return data;
		}

		const contentType: string = ctx?.getResponse()?.getHeader("Content-Type");
		if (contentType && !contentType.toLocaleLowerCase().includes("application/json")) {
			let length = ctx.getResponse().getHeader("Content-Length");
			if (!length && this.isBlob(data)) {
				length = data?.length;
			}

			ctx.getResponse().writeHead(200, {
				"Content-Type": contentType,
				"Content-Disposition": ctx.getResponse().getHeader("Content-Disposition"),
				"Content-Length": length,
			});
			return data;
		}

		if (data instanceof ResultModel) {
			ctx.getResponse().json(data);

			return data;
		}

		return data instanceof Outcome ? ResultModel.successOutcome(data) : ResultModel.success(data);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private isBlob(data: any): data is {length: number} {
		return "length" in data;
	}
}
