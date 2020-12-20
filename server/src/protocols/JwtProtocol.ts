import {Inject, Req} from "@tsed/common";
import {Forbidden} from "@tsed/exceptions";
import {Arg, OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {ExtractJwt, Strategy, StrategyOptions} from "passport-jwt";
import {SessionDTO} from "../models/dto/Session.dto";
import {User, UserType} from "../models/User";
import {UserService} from "../services/User.service";
import {Randon} from "../utils/randon";

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      ExtractJwt.fromHeader(process.env.JWT_ACCESS_TOKEN || ""),
      ExtractJwt.fromUrlQueryParameter("auth_token"),
      ExtractJwt.fromUrlQueryParameter(process.env.JWT_ACCESS_TOKEN || "")
    ]),
    secretOrKey: process.env.API_SECRET,
    algorithms: ["HS256"],
    issuer: "localhost",
    audience: "localhost"
  }
})
export class JwtProtocol implements OnVerify, OnInstall {
  @Inject()
  private userService: UserService;

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: User): Promise<User | boolean> {
    if (jwtPayload.enabled === false) {
      throw new Forbidden("User account disabled, please contact support!");
    }

    const userType: UserType = Randon.decrypt(jwtPayload.type) as UserType;

    const user = await this.userService.getFromSession(+Randon.decrypt(`${jwtPayload.id || ""}`), userType);
    if (!user || user.type !== userType) {
      throw new Forbidden("Usuario com perfil de accesso diferente do cadastrado");
    }

    req.user = user;
    if (req.session) {
      const session: SessionDTO = req.session;
      session.user = user;
    }

    return user ? user : false;
  }

  $onInstall(): void {
    // intercept the strategy instance to adding extra configuration
  }
}
