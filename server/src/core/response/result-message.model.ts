import {CollectionOf, Description, Property, Title} from "@tsed/schema";

export class ResultMessageModel {
  @Title("name")
  @Description("name of the error send by server")
  @Property()
  name?: string;

  @Title("status")
  @Description("status of the request")
  @Property()
  status?: boolean;

  @Title("message")
  @Description("message of the error send by server")
  @Property()
  message: string;

  @Title("errors")
  @Description("errors return from server")
  @Property()
  errors?: Map<string, Error[]> = undefined;

  @Title("code")
  @Description("server code to map on the application a friendly message to show the user")
  @Property()
  code?: number;

  @Title("httpStatus")
  @Description("http response code returned from the server error")
  @Property()
  httpStatus?: number;

  @Title("stack")
  @Description("stack trace of the error ")
  @Property()
  stack?: string;

  @Title("reasons")
  @Description("reasons used to describe the reason why the issue was not completed successfully")
  @CollectionOf(String)
  reasons?: string[];

  static errorMessage(
    message: string,
    errors?: Map<string, Error[]>,
    code?: number,
    name?: string,
    httpStatus?: number,
    stack?: string,
    reasons?: string[]
  ): ResultMessageModel {
    const result = new ResultMessageModel();
    result.message = message;
    result.status = false;
    result.errors = errors || new Map<string, Error[]>();
    result.code = code;
    result.name = name;
    result.httpStatus = httpStatus;
    result.stack = stack;
    result.reasons = reasons;

    return result;
  }

  static message(message: string, status: boolean): ResultMessageModel {
    const result = new ResultMessageModel();
    result.message = message;
    result.status = status;

    return result;
  }

  static parseMessage(obj: ResultMessageModel): ResultMessageModel {
    const result = new ResultMessageModel();
    result.name = obj.message;
    result.message = obj.message;
    result.status = obj.status;
    result.errors = obj.errors;
    result.code = obj.code;
    result.httpStatus = obj.httpStatus;
    result.stack = obj.stack;
    result.reasons = obj.reasons;

    return result;
  }
}
