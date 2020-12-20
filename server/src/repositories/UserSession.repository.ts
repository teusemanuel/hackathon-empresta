import { Repository, EntityRepository } from "typeorm";
import { UserSession } from "../models/UserSession";

@EntityRepository(UserSession)
export class UserSessionRepository extends Repository<UserSession> {}
