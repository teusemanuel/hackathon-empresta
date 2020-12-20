import {CollectionOf, Description, Example, MaxLength, MinLength, Property, Required} from "@tsed/schema";
import {Column, Entity, Index, OneToMany, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {BoolBitTransformer} from "../utils/db/bool-bit-transformer";
import {Client} from "./Client";
import {Token} from "./Token";
import {UserSession} from "./UserSession";

export enum UserType {
  "ADMIN",
  "CLIENT"
}

@Index("idx_user_id_unique", ["id"], {unique: true})
@Index("idx_user_identifier_unique", ["identifier"], {unique: true})
@Entity("user", {schema: "empresta"})
@Description("Usuario do sistema, client ou admin")
export class User {
  @PrimaryGeneratedColumn({type: "int", name: "id", unsigned: true})
  @Description("Pk auto increment do usuario")
  @Property()
  id: number;

  @Column("varchar", {name: "identifier", unique: true, length: 20})
  @Description("Identificador do usuario utilizado para efetuar login, EX: CPF / CNPJ")
  @MaxLength(20)
  @Required()
  @Property()
  identifier: string;

  @Column("varchar", {name: "email", length: 200})
  @Description("Email do usuário utilizado para efetuar login")
  @MaxLength(200)
  @Required()
  @Property()
  email: string;

  @Column("int", {name: "client_id", unsigned: true})
  @Description("Id do client vinculado a esse client")
  @Property()
  clientId: number;

  @Column("enum", {name: "type", enum: UserType, comment: "Coluna para identificar o tipo de usuario"})
  @Description("Identificação do tipo de usuario")
  @Example("ADMIN / CLIENT")
  @Property()
  type: UserType;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  @Description("Data da criação do usuario")
  @Property()
  createdAt: Date;

  @Column("tinyint", {name: "enabled", default: () => "'0'", transformer: new BoolBitTransformer()})
  @Description("Indica se o usuario está ativo ou se foi desativado")
  @Property()
  enabled: boolean;

  @Column("varchar", {name: "password", length: 150})
  @Description("Senha utilizada pelo usuario para autenticar na aplicação")
  @MaxLength(150)
  @Required()
  @MinLength(6)
  @Property()
  password: string;

  @OneToOne(() => Client, (client) => client.user)
  @Description("Referencai do client caso esse user seja do tipo client")
  @Property({use: Client})
  clients: Client;

  @OneToMany(() => Token, (token) => token.user)
  @Description("Tokens das sessões abertas pelo user ao logar na aplicação")
  @CollectionOf(Token)
  @Property({use: Token})
  tokens: Token[];

  @OneToMany(() => UserSession, (userSession) => userSession.user)
  @Description("Sessões abertas pelo user ao logar na aplicação, contendo informações como SO, versão, se é bot, ip dentre outros")
  @CollectionOf(UserSession)
  @Property({use: UserSession})
  userSessions: UserSession[];
}
