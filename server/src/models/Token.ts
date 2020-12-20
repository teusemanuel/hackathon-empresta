import {CollectionOf, Description, MaxLength, Property} from "@tsed/schema";
import {Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {UserSession} from "./UserSession";

@Index("idx_token_id_unique", ["id"], {unique: true})
@Index("idx_fk_token_user", ["userId"], {})
@Entity("token", {schema: "empresta"})
@Description("Token por onde o usuario consegue acesso ao sistema")
export class Token {
  @PrimaryGeneratedColumn("increment", {
    type: "bigint",
    name: "id",
    comment: "PK da tabela de tokens",
    unsigned: true
  })
  @Description("PK da tabela de tokens")
  @Property()
  id?: number;

  @Column("varchar", {name: "access_token", length: 1000})
  @Description("Token utilizado para acessar a aplicação")
  @MaxLength(1000)
  @Property()
  accessToken: string;

  @Column("datetime", {name: "access_token_expires_at"})
  @Description("Data de expiração do token")
  @Property()
  accessTokenExpiresAt: Date;

  @Column("varchar", {name: "refresh_token", length: 255})
  @Description("Token utilizado para atualizar o token de acesso")
  @MaxLength(255)
  @Property()
  refreshToken: string;

  @Column("datetime", {name: "refresh_token_Expires_at"})
  @Description("Data de expiração do refresh token")
  @Property()
  refreshTokenExpiresAt: Date;

  @Column("int", {name: "user_id", unsigned: true})
  @Description("FK do usuario associado ao token de acesso")
  @Property()
  userId?: number;

  @ManyToOne(() => User, (user) => user.tokens, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{name: "user_id", referencedColumnName: "id"}])
  @Description("Referencia do usuario associado ao token de acesso")
  @Property({use: User})
  user?: User;

  @OneToMany(() => UserSession, (userSession) => userSession.token)
  @Description("Referencia das sessões que foram abertas utilizando esse token")
  @CollectionOf(UserSession)
  @Property({use: UserSession})
  userSessions?: UserSession[];
}
