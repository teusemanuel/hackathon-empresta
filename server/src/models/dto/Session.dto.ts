import {Session} from "express-session";
import {User} from "../User";

export type SessionDTO = Session & {user?: User & {token?: string}};
