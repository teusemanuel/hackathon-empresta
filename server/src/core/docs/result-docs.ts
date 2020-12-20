import { Type, useDecorators } from "@tsed/core";
import { Returns } from "@tsed/schema";
import { StatusCodes } from "http-status-codes";
import { ResultMessageModel } from "../response/result-message.model";
import { ResultModel, ResultModelArray } from "../response/result.model";

export function ResultDocs<T>(result: Type<T>, isArray = false, description = "Success"): MethodDecorator {
	const successResult = !isArray
	? Returns(StatusCodes.OK, ResultModel).Nested(result)
	: Returns(StatusCodes.OK, ResultModelArray).Nested(result);
	return useDecorators(
		successResult
		.Description(description),
		Returns(StatusCodes.BAD_REQUEST, ResultMessageModel)
		.Description("Missing required parameter")
		.Examples({
			"application/json": {
				message: "Parametro .... é obrigatório!",
				status: StatusCodes.BAD_REQUEST
			}
		}),
		Returns(StatusCodes.UNAUTHORIZED, ResultMessageModel)
		.Description("Unauthorized")
		.Examples({
				"application/json": {
					message: "Usuario Não autorizado!",
					status: StatusCodes.UNAUTHORIZED
				}
			}
		),
		Returns(StatusCodes.FORBIDDEN, ResultMessageModel)
		.Description("Forbidden")
		.Examples({
				"application/json": {
					message: "Acesso Negado!",
					status: StatusCodes.FORBIDDEN
				}
			}
		),
	);
}
