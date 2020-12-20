import {Request} from "@tsed/common";
import {Injectable} from "@tsed/di";
import {Forbidden, NotFound, Unauthorized} from "@tsed/exceptions";
import {compare} from "bcrypt";
import {Token} from "../models/Token";
import {UserRepository} from "../repositories/User.repository";
import {ipFromRequest} from "../utils/http/request-utils";
import {StringUtils} from "../utils/string-utils";
import {TokenService} from "./Token.service";
import {UserSessionService} from "./UserSession.service";

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private tokenService: TokenService, private userSessionService: UserSessionService) {}

  async login(identifier: string, password: string, req: Request): Promise<Token> {
    let user = await this.userRepository.findOne(
      {identifier: StringUtils.onlyDigits(identifier) || ""},
      {select: ["id", "password", "type", "enabled"]}
    );
    if (!user) {
      user = await this.userRepository.findOne({email: identifier}, {select: ["id", "password", "type", "enabled"]});
    }
    if (!user) {
      throw new NotFound("User not found.");
    }
    if (!user.enabled) {
      throw new Forbidden("Unverified user account, please check in your email box!");
    }
    const match = await compare(password, user.password);
    if (!match) {
      throw new Unauthorized("Wrong credentials provided");
    }

    const details = req.useragent;
    const ip = ipFromRequest(req);
    const token = await this.tokenService.create(user);
    await this.userSessionService.create(token.id, user.id, ip, details);
    this.tokenService.removeSensitiveData(token);
    return token;
  }

  async refresh(refreshToken: string, accessToken: string, req: Request): Promise<Token> {
    let token = await this.tokenService.findByRefreshTokenAndAccessToken(refreshToken, accessToken);

    if (!token?.user?.enabled) {
      throw new Forbidden("Unverified user account, please check in your email box!");
    }

    token = await this.tokenService.refresh(token);

    const details = req.useragent;
    const ip = ipFromRequest(req);
    await this.userSessionService.updateByToken(token.id, ip, details);
    this.tokenService.removeSensitiveData(token);
    return token;
  }
}
