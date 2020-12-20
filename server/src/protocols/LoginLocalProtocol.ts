import {BodyParams, Req} from "@tsed/common";
import {OnVerify, Protocol} from "@tsed/passport";
import {IStrategyOptions, Strategy} from "passport-local";
import {Credentials} from "../models/dto/Credentials.dto";
import {Token} from "../models/Token";
import {AuthService} from "../services/Auth.service";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "identifier",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify {
  constructor(private authService: AuthService) {}
  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials): Promise<Token> {
    const {identifier, password} = credentials;
    return this.authService.login(identifier, password, request);
  }
}
