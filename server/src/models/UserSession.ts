import {Description, Example, MaxLength, Property} from "@tsed/schema";
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BoolBitTransformer} from "../utils/db/bool-bit-transformer";
import {Token} from "./Token";
import {User} from "./User";

@Index("idx_fk_user_session_token", ["tokenId"], {})
@Index("idx_fk_user_session_user", ["userId"], {})
@Index("idx_user_session_id_unique", ["id"], {unique: true})
@Entity("user_session", {schema: "empresta"})
@Description("Sessão do usuario")
export class UserSession {
  @PrimaryGeneratedColumn("increment", {unsigned: true, name: "id", type: "bigint", comment: "PK da tabela de sessão do usuario"})
  @Description("PK da tabela de sessão do usuario")
  @Property()
  id: number;

  @Column("int", {name: "user_id", unsigned: true})
  @Description("FK do usuario que iniciou a sessão")
  @Property()
  userId: number;

  @Column("varchar", {name: "push_token", nullable: true, length: 200})
  @Description("Token utilizado para envio de notificaçõe via push")
  @Property()
  @MaxLength(200)
  pushToken?: string;

  @Column("tinyint", {name: "is_bot", default: () => "'0'", transformer: new BoolBitTransformer()})
  @Description("Indica se a sessão foi iniciada por um bot")
  @Property()
  isBot: boolean;

  @Column("tinyint", {name: "is_desktop", default: () => "'0'", transformer: new BoolBitTransformer()})
  @Description("Inidica se a sessão foi iniciada apartir de um computador")
  @Property()
  isDesktop: boolean;

  @Column("tinyint", {name: "is_mobile", default: () => "'0'", transformer: new BoolBitTransformer()})
  @Description("Inidica se a sessão foi iniciada apartir de um telefone")
  @Property()
  isMobile: boolean;

  @Column("varchar", {name: "ip_address", length: 25})
  @Description("Endereço IP publico do computador, telefone ou bot que iniciou a sessão")
  @MaxLength(25)
  @Property()
  ipAddress: string;

  @Column("varchar", {name: "platform", nullable: true, length: 150})
  @Description("Plataforma utilizada para iniciar uma sessão")
  @Example("Android/iPad/iPhone")
  @MaxLength(150)
  @Property()
  platform?: string;

  @Column("varchar", {name: "browser", nullable: true, length: 150})
  @Description("Browser utilizado para iniciar a sessão")
  @Example("Chrome/Dalvik/CFNetwork")
  @MaxLength(150)
  @Property()
  browser?: string;

  @Column("varchar", {name: "version", nullable: true, length: 50})
  @Description("Versão do SO")
  @MaxLength(50)
  @Property()
  version?: string;

  @Column("varchar", {name: "os", nullable: true, length: 50})
  @Description("Sistema operacional utilizado para iniciar a sessão")
  @Example("Linux/iOS/Windows")
  @MaxLength(50)
  @Property()
  os?: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  @Description("Data de criação da sessão")
  @Property()
  createdAt: Date;

  @Column("datetime", {
    name: "last_session_at",
    default: () => "CURRENT_TIMESTAMP"
  })
  @Description("Data da ultima vez que a sessão foi utilizada")
  @Property()
  lastSessionAt: Date;

  @Column("bigint", {name: "token_id", unsigned: true})
  @Description("FK do token associado a sessão")
  @Property()
  tokenId: number;

  @ManyToOne(() => Token, (token) => token.userSessions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{name: "token_id", referencedColumnName: "id"}])
  @Description("Referencia do tokena associado a sessão")
  @Property({use: Token})
  token: Token;

  @ManyToOne(() => User, (user) => user.userSessions, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{name: "user_id", referencedColumnName: "id"}])
  @Description("Referencia do usuario que abriu a sessão")
  @Property({use: User})
  user: User;
}
