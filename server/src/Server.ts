import "@tsed/ajv";
import {BeforeRoutesInit, PlatformApplication} from "@tsed/common";
import {Configuration, Inject} from "@tsed/di";
import {BadRequest} from "@tsed/exceptions";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import "@tsed/typeorm";
import compress from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import session from "express-session";
import * as memoryStore from "memorystore";
import methodOverride from "method-override";
import {Strategy} from "passport-jwt";
import "./core/response/result.mapper";
import typeormConfig from "./core/typeorm";
import "./filters/http-exception-filter";
import {WrapperResponseFilter} from "./filters/wrapper.response-filter";
import {User} from "./models/User";

export const rootDir = __dirname;
const MemoryStore = memoryStore(session);

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
          title: "Hackathon Empresta Swagger documentation",
          description: "Api utilizada pelos serviços da Empresta no evento Hackathon",
          contact: {
            email: "teusemanuel@gmail.com",
            name: "Mateus Emanuel Araujo"
          }
        },
        security: [{"Empresta-Auth-Token": []}],
        components: {
          securitySchemes: {
            "Empresta-Auth-Token": {
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
      spec: {
        openapi: "3.1.0",
        info: {
          version: "2.0.1",
          title: "Hackathon Empresta Swagger documentation",
          description: "Api utilizada pelos serviços da Empresta no evento Hackathon",
          contact: {
            email: "teusemanuel@gmail.com",
            name: "Mateus Emanuel Araujo"
          }
        },
        security: [{"Empresta-Auth-Token": []}],
        components: {
          securitySchemes: {
            "Empresta-Auth-Token": {
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
    userInfoModel: User,
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
export class Server implements BeforeRoutesInit {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  allowedOrigins = ["http://0.0.0.0:9001", "https://0.0.0.0:9001", "http://localhost:9001", "https://localhost:9001"];

  // Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
  corsOptions = {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void => {
      if (!requestOrigin || this.allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(new BadRequest("Origin not allowed by CORS"));
      }
    }
  };

  $beforeRoutesInit(): void {
    this.app
      .use(cors(this.corsOptions))
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(express.json())
      .use(
        express.urlencoded({
          extended: true
        })
      )
      .use(
        session({
          secret: process.env.SESSION_COOKIE_SECRET as string,
          resave: false,
          saveUninitialized: true,
          store: new MemoryStore({
            checkPeriod: 86400000 // prune expired entries every 24h
          }),
          cookie: {
            maxAge: 86400000,
            secure: false // set true if HTTPS is enabled
          }
        })
      );
  }
}
