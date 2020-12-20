import {Description, Example, Required} from "@tsed/schema";

@Description("Credenciais do usuario para efetuar login na aplicação")
export class Credentials {
	@Description("User password")
	@Example("/5gftuD/")
	@Required()
	password: string;

	@Description("User identifier")
	@Example("user@domain.com or 123.456.789-01")
	@Required()
	identifier: string;

	@Description("phone token")
	pushToken?: string;
}
