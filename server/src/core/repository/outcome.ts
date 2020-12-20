import {Property} from "@tsed/schema";
import {PageInfo} from "./page-info";

export class Outcome<T> {
  @Property()
  protected result: T;

  @Property()
  private pageInfo: PageInfo;

  // STATIC HELPERS
  /////////////////
  static ResultSuccess<T>(result: T): Outcome<T> {
    const outcome = new Outcome<T>();
    outcome.result = result;

    return outcome;
  }

  static Error<E>(): Outcome<E> {
    return new Outcome<E>();
  }

  // GETTERS
  //////////
  hasResult(): boolean {
    return !this.hasNoResult();
  }

  hasNoResult(): boolean {
    return !this.result;
  }

  getResult(): T {
    return this.result;
  }

  getPageInfo(): PageInfo {
    return this.pageInfo;
  }
}
