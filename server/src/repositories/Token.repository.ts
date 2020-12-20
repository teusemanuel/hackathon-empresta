import { Repository, EntityRepository } from "typeorm";
import { Token } from "../models/Token";

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}
