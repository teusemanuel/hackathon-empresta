import {Get} from "@tsed/common";

export class HelloWorldControllerBase {
  @Get("/")
  get() {
    return "hello";
  }
}
