import "@tsed/ajv";
import {PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import "@tsed/typeorm";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import methodOverride from "method-override";
import typeormConfig from "./config/typeorm";
import {UserModel} from "./models/UserModel";

export const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: [
    // application media types
    "application/json",
    "application/octet-stream",
    "application/ogg",
    "application/pdf",
    "application/xml",
    "application/zip",

    // audio media types
    "audio/mpeg",
    "audio/x-ms-wma",
    "audio/x-wav",

    // image media types
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-icon",
    "image/svg+xml",

    // text media types
    "text/css",
    "text/csv",
    "text/plain",
    "text/xml",

    // video media types
    "video/mpeg",
    "video/mp4",
    "video/quicktime",
    "video/x-ms-wmv",
    "video/x-msvideo",
    "video/x-flv",
    "video/webm",

    // vnd media types
    "application/vnd.android.package-archive",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.spreadsheet",
    "application/vnd.oasis.opendocument.presentation",
    "application/vnd.oasis.opendocument.graphics",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.mozilla.xul+xml"
  ],
  httpPort: process.env.PORT_API_DIST_SERVER || 9001,
  httpsPort: false,
  mount: {
    "/v1/": [`${rootDir}/controllers/v1/**/*.{ts,js}`, `${rootDir}/controllers/common/**/*.{ts,js}`],
    "/v2/": [`${rootDir}/controllers/v2/**/*.{ts,js}`, `${rootDir}/controllers/common/**/*.{ts,js}`]
  },
  ajv: {
    errorFormatter: (error): string => `At ${error.modelName}${error.dataPath}, value '${error.data}' ${error.message}`,
    verbose: true
  },
  logger: {
    level: process.env.NODE_ENV === "development" ? "debug" : "warn",
    logRequest: process.env.NODE_ENV === "development",
    debug: process.env.NODE_ENV === "development",
    requestFields: ["method", "url", "headers", "body", "query", "params", "duration"]
  },
  responseFilters: [WrapperResponseFilter],
  componentsScan: [
    `${rootDir}/services/**/**.{ts,js}`,
    `${rootDir}/middlewares/**/**.{ts,js}`,
    `${rootDir}/decorators/**/**.{ts,js}`,
    `${rootDir}/repositories/**/**.{ts,js}`,
    `${rootDir}/core/**/**.{ts,js}`,
    `${rootDir}/protocols/**/**.{ts,js}` // scan protocols directory
  ],
  swagger: [
    {
      path: "/doc/v1",
      doc: "api-v1",
      showExplorer: true,
      specVersion: "3.0.3",
      // viewPath: process.env.NODE_ENV === "development" ? `${rootDir}/../views/swagger.ejs` : false,
      spec: {
        openapi: "3.1.0",
        info: {
          version: "1.0.1",
          title: "Castelli Swagger documentation",
          description: "Api utilizada pelos serviços da Castelli Events ©",
          contact: {
            email: "teusemanuel@gmail.com",
            name: "Mateus Emanuel Araujo"
          }
        },
        security: [{"Castelli-Auth-Token": []}],
        components: {
          securitySchemes: {
            "Castelli-Auth-Token": {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    },
    {
      path: "/doc/v2",
      doc: "api-v2",
      showExplorer: true,
      specVersion: "3.0.3",
      // viewPath: process.env.NODE_ENV === "development" ? `${rootDir}/../views/swagger.ejs` : false,
      spec: {
        openapi: "3.1.0",
        info: {
          version: "2.0.1",
          title: "Castelli Swagger documentation",
          contact: {
            email: "teusemanuel@gmail.com",
            name: "Mateus Emanuel Araujo"
          }
        },
        security: [{"Castelli-Auth-Token": []}],
        components: {
          securitySchemes: {
            "Castelli-Auth-Token": {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        }
      }
    }
  ],
  uploadDir: `${rootDir}/upload-files`,
  multer: {
    limits: {
      fieldNameSize: 1048576, // max field name size 1mb to upload
      fieldSize: 5242880, // max field size 5mb to upload
      fileSize: 26214400 // max file size 25mb to upload
    }
  },
  passport: {
    userInfoModel: UserModel,
    protocols: {
      jwt: {
        name: "jwt",
        useStrategy: Strategy,
        settings: {
          secretOrKey: process.env.API_SECRET,
          issuer: "localhost",
          audience: "localhost"
        }
      }
    }
  },
  views: {
    root: `${rootDir}/../views`,
    viewEngine: "ejs"
  },
  typeorm: typeormConfig,
  exclude: ["**/*.spec.ts", `${rootDir}/upload-files`]
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(
        bodyParser.urlencoded({
          extended: true
        })
      );
  }
}
