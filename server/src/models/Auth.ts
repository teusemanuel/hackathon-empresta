import {Property, Required} from "@tsed/schema";

export class Auth {
  @Property()
  @Required()
  refreshToken: string;

  @Property()
  pushToken: string;

  @Property()
  @Required()
  tokenType: string;
}
