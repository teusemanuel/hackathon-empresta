import {Context, Middleware, Req, Res, UseBefore} from "@tsed/common";
import {StoreSet, Type, useDecorators} from "@tsed/core";
import {Forbidden, Unauthorized} from "@tsed/exceptions";
import {Authorize} from "@tsed/passport";
import {In, Returns, Security} from "@tsed/schema";
import {StatusCodes} from "http-status-codes";
import {ResultModel, ResultModelArray} from "../core/response/result.model";
import {User} from "../models/User";

export type AcceptRolesOptions = "ADMIN" | "ALL";

@Middleware()
export class AuthorizeWithRolesMiddleware {
  async use(@Req() request: Req, @Res() res: Res, @Context() context: Context): Promise<void> {
    if (request.user && request.isAuthenticated()) {
      const user: User = request.user as User;
      const roles: AcceptRolesOptions | AcceptRolesOptions[] = context.endpoint.get(AuthorizeWithRolesMiddleware);

      if (roles?.includes("ALL") != true) {
        throw new Forbidden("Ação não permitida para o seu perfil de usuário!");
      }
    } else {
      throw new Unauthorized("User not autenticated!");
    }
  }
}

export function AuthorizeWithRoles<T>(
  result?: Type<T>,
  isArray = false,
  description = "Success",
  roles: AcceptRolesOptions | AcceptRolesOptions[] = "ALL"
): ClassDecorator & MethodDecorator {
  const successResult = !isArray
    ? Returns(StatusCodes.OK, ResultModel).Nested(result)
    : Returns(StatusCodes.OK, ResultModelArray).Nested(result);
  return useDecorators(
    Security("Empresta-Auth-Token", ...(roles || [])),
    StoreSet(AuthorizeWithRolesMiddleware, roles),
    UseBefore(AuthorizeWithRolesMiddleware),
    Authorize("jwt"),
    In("header")
      .Type(String)
      .Name(process.env.JWT_ACCESS_TOKEN || "")
      .Required(false),
    successResult.Description(description),
    Returns(StatusCodes.UNAUTHORIZED)
      .Description("Unauthorized")
      .Examples({
        "application/json": {
          message: "Usuario não autenticado!",
          status: StatusCodes.UNAUTHORIZED,
          stack: "UNAUTHORIZED: Usuario não autenticado!"
        }
      }),
    Returns(StatusCodes.FORBIDDEN)
      .Description("Forbidden")
      .Examples({
        "application/json": {
          message: "Usuario não tem permissão!",
          status: StatusCodes.FORBIDDEN,
          stack: "FORBIDDEN: Usuario não tem permissão!"
        }
      })
  );
}
