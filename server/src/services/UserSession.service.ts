import {Injectable} from "@tsed/di";
import {NotFound} from "@tsed/exceptions";
import {Details} from "express-useragent";
import {UserSession} from "../models/UserSession";
import {UserSessionRepository} from "../repositories/UserSession.repository";

@Injectable()
export class UserSessionService {
  constructor(private userSessionRepository: UserSessionRepository) {}

  async create(tokenId: number | undefined, userId: number, ipAddress: string, details?: Details): Promise<UserSession> {
    const userSession: UserSession = this.userSessionRepository.create({
      ipAddress,
      isBot: details?.isBot == true,
      isDesktop: details?.isDesktop == true,
      isMobile: details?.isMobile == true,
      platform: details?.platform,
      browser: details?.browser,
      version: details?.version,
      os: details?.os,
      tokenId,
      userId,
      createdAt: new Date(),
      lastSessionAt: new Date()
    });

    return this.userSessionRepository.save(userSession, {reload: false});
  }

  async updateByToken(tokenId: number | undefined, ipAddress: string, details?: Details): Promise<UserSession> {
    let userSession = await this.userSessionRepository.findOne({tokenId});

    if (!userSession) {
      throw new NotFound("User Session not valid");
    }

    userSession = {
      ...userSession,
      ...{
        ipAddress,
        isBot: details?.isBot == true,
        isDesktop: details?.isDesktop == true,
        isMobile: details?.isMobile == true,
        platform: details?.platform,
        browser: details?.browser,
        version: details?.version,
        os: details?.os,
        lastSessionAt: new Date()
      }
    };

    return userSession;
  }
}
