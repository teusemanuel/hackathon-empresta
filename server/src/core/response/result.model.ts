import {CollectionOf, Description, Example, Generics, Property, Title} from "@tsed/schema";
import {Outcome} from "../repository/outcome";
import {PageInfo} from "../repository/page-info";

@Generics("T")
export class ResultModel<T> {
  @Title("result")
  @Description("Object resulted from the database")
  @Property("T")
  result?: T | T[];

  @Title("status")
  @Description("status of the request")
  @Property()
  status?: boolean;

  @Title("pageInfo")
  @Description("The info when use the pagination query")
  @Example("pageIndex = 0")
  @Property()
  pageInfo?: PageInfo;

  constructor(result?: T | T[], pageInfo?: PageInfo, status?: boolean) {
    this.result = result;
    this.status = status;
    this.pageInfo = pageInfo;
  }

  public static success<T>(result: T): ResultModel<T> {
    return new ResultModel(result, undefined, true);
  }

  public static successOutcome<T>(resultOut: Outcome<T>): ResultModel<T> {
    let result = undefined;
    if (resultOut.hasResult()) {
      result = resultOut.getResult();
    }

    return new ResultModel(result, resultOut.getPageInfo(), true);
  }
}

@Generics("E")
export class ResultModelArray<T> {
  @Title("result")
  @Description("Object resulted from the database")
  @CollectionOf("E")
  result?: T[];

  @Title("status")
  @Description("status of the request")
  @Property()
  status?: boolean;

  @Title("pageInfo")
  @Description("The info when use the pagination query")
  @Example("pageIndex = 0")
  @Property()
  pageInfo?: PageInfo;

  constructor(result?: T[], pageInfo?: PageInfo, status?: boolean) {
    this.result = result;
    this.status = status;
    this.pageInfo = pageInfo;
  }

  public static success<T>(result: T[]): ResultModelArray<T> {
    return new ResultModelArray(result);
  }

  public static successOutcome<T>(resultOut: Outcome<T[]>): ResultModelArray<T> {
    let result = undefined;
    if (resultOut.hasResult()) {
      result = resultOut.getResult();
    }

    return new ResultModelArray(result, resultOut.getPageInfo());
  }
}
