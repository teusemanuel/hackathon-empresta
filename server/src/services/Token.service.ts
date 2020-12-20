import {Constant, Injectable} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import moment from "moment";
import {MoreThanOrEqual} from "typeorm";
import {Token} from "../models/Token";
import {User} from "../models/User";
import {TokenRepository} from "../repositories/Token.repository";
import {Randon} from "../utils/randon";

@Injectable()
export class TokenService {
  @Constant("passport.protocols.jwt.settings")
  jwtSettings: {issuer: string; audience: string; secretOrKey: string};

  constructor(private tokenRepository: TokenRepository) {}

  async create(user: User): Promise<Token> {
    return this.getAccessTokenFromUser(user);
  }

  async refresh(token: Token): Promise<Token> {
    return this.getAccessTokenFromUser(token.user, token);
  }

  async findByRefreshTokenAndAccessToken(refreshToken: string, accessToken: string): Promise<Token> {
    const token = await this.tokenRepository.findOne({
      select: ["id", "userId"],
      where: {refreshToken, accessToken, refreshTokenExpiresAt: MoreThanOrEqual(new Date())},
      relations: ["user"]
    });
    if (!token) {
      throw new NotFound("Token not valid");
    }

    return token;
  }

  removeSensitiveData(token: Token): void {
    delete token.user;
    delete token.userId;
    delete token.userSessions;
    delete token.id;
  }

  private async getAccessTokenFromUser(user?: User, oldToken?: Token): Promise<Token> {
    const {issuer, audience, secretOrKey} = this.jwtSettings;
    const userToken = {
      id: Randon.encrypt(`${user?.id}`),
      type: Randon.encrypt(`${user?.type}`),
      enabled: user?.enabled,
      createdAt: new Date(),
      iss: issuer,
      aud: audience
    };

    const accessTokenExpirationDate = moment().add(10, "minutes").toDate();
    const refreshTokenExpirationDate = moment().add(30, "days").toDate();
    const token = jwt.sign(userToken, secretOrKey || "", {algorithm: "HS256", expiresIn: "10m" /*expires in 10 minutes*/});

    const accessToken = oldToken || new Token();
    accessToken.refreshToken = crypto.randomBytes(60).toString("hex");
    accessToken.accessToken = token;
    accessToken.userId = user?.id;
    accessToken.refreshTokenExpiresAt = refreshTokenExpirationDate;
    accessToken.accessTokenExpiresAt = accessTokenExpirationDate;

    return this.tokenRepository.save(accessToken);
  }
}
