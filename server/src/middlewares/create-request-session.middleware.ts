import {Middleware, Req} from "@tsed/common";
import {SessionDTO} from "../models/dto/Session.dto";
import {User} from "../models/User";

@Middleware()
export class CreateRequestSessionMiddleware {
  use(@Req() request: Req): void {
    if (request.session) {
      const session: SessionDTO = request.session;
      session.user = session.user || new User();
    }
  }
}
