import {Injectable} from "@tsed/di";
import {User, UserType} from "../models/User";
import {UserRepository} from "../repositories/User.repository";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getFromSession(id: number, userType: UserType): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id, {
      cache: 10 * 60 * 1000,
      relations: ["clients"],
      select: ["id", "identifier", "email", "enabled", "name"]
    }); //cache of 10 min from session
    if (user) {
      user.type = userType;
    }
    return user;
  }

  async fetchUser(user?: User): Promise<User | undefined> {
    user = await this.userRepository.findOne(user, {relations: ["clients"]});
    if (user) {
      user.id = 0;
      user.password = "";
    }
    return user;
  }
}
