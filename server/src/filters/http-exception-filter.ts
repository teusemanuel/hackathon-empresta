import {Catch, ExceptionFilterMethods, PlatformContext, ResponseErrorObject} from "@tsed/common";
import {Exception} from "@tsed/exceptions";
import {JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";
import {ResultMessageModel} from "../core/response/result-message.model";

@Catch(Error, Exception, TokenExpiredError, JsonWebTokenError)
export class HttpExceptionFilter implements ExceptionFilterMethods {
	catch(exception: Exception & Error, ctx: PlatformContext): void {
		const {response, logger} = ctx;
		const error = this.mapError(exception);
		const headers = this.getHeaders(exception);

		logger.error({
			error,
		});

		response
			.setHeaders(headers)
			.status(error.httpStatus || 500)
			.body(error);
	}

	mapError(error: Exception): ResultMessageModel {
		return {
			name: error.origin?.name || error.name,
			message: error.message,
			httpStatus: error.status || 500,
			reasons: this.getErrors(error),
		};
	}

	protected getErrors(error: Exception): string[] {
		return [error, error.origin].filter(Boolean).reduce((errs, {errors}: ResponseErrorObject) => {
			return [...errs, ...(errors || [])];
		}, []);
	}

	protected getHeaders(error: Exception): {[key: string]: unknown} {
		return [error, error.origin].filter(Boolean).reduce((obj, {headers}: ResponseErrorObject) => {
			return {
				...obj,
				...(headers || {}),
			};
		}, {});
	}
}
