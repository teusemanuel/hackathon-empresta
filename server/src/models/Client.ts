import {Description, MaxLength, Property, Required} from "@tsed/schema";
import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Index("idx_client_id_unique", ["id"], {unique: true})
@Index("idx_fk_client_user", ["userId"], {})
@Entity("client", {schema: "empresta"})
@Description("Cliente")
export class Client {
  @PrimaryGeneratedColumn({type: "int", name: "id", unsigned: true})
  @Description("Id auto gerado da tabela de client")
  @Property()
  id: number;

  @Column("int", {name: "user_id", unsigned: true})
  @Description("Id do user vinculado a esse client")
  @Property()
  userId: number;

  @Column("varchar", {name: "name", length: 200})
  @Description("Nome do cliente")
  @MaxLength(200)
  @Required()
  @Property()
  name: string;

  @Column("varchar", {name: "mothers_name", length: 200})
  @Description("Nome da mãe do cliente")
  @MaxLength(200)
  @Required()
  @Property()
  mothersName: string;

  @Column("varchar", {name: "cel_phone", nullable: true, length: 20})
  @Description("Numero de telefone do cliente")
  @MaxLength(20)
  @Property()
  celPhone?: string;

  @Column("varchar", {name: "landline", nullable: true, length: 20})
  @Description("Numero de telefone fixo do cliente")
  @MaxLength(20)
  @Property()
  landline?: string;

  @Column("varchar", {name: "zip_code", nullable: true, length: 20})
  @Description("CEP do cliente")
  @MaxLength(20)
  @Property()
  zipCode?: string;

  @Column("varchar", {name: "address", nullable: true, length: 100})
  @Description("Logradouro do cliente")
  @MaxLength(100)
  @Property()
  address?: string;

  @Column("int", {name: "number", nullable: true})
  @Description("Número do cliente")
  @Property()
  number?: number;

  @Column("varchar", {name: "city", nullable: true, length: 100})
  @Description("Cidade do cliente")
  @MaxLength(100)
  @Property()
  city?: string;

  @Column("varchar", {name: "state", nullable: true, length: 2})
  @Description("Estado do cliente")
  @MaxLength(2)
  @Property()
  state?: string;

  @Column("int", {name: "registration", nullable: true})
  @Description("Matrícula do cliente")
  @Property()
  registration?: number;

  @Column("datetime", {
    name: "birthday",
    default: () => "CURRENT_TIMESTAMP"
  })
  @Description("Data de Aniversario do cliente")
  @Property()
  birthday: Date;

  @ManyToOne(() => User, (user) => user.clients, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION"
  })
  @JoinColumn([{name: "user_id", referencedColumnName: "id"}])
  @Description("Referendia do user vinculado ao cliente")
  @Property({use: User})
  user: User;
}
