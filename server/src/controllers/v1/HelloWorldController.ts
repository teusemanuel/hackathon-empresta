import {Controller} from "@tsed/common";
import {HelloWorldControllerBase} from "../common/HelloWorldController.base";

@Controller("/hello-world")
export class HelloWorldController extends HelloWorldControllerBase {}
