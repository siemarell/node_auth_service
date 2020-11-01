import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import { router } from "./routes";
import errorHandler from "errorhandler";
import express from "express";

export const app = express();

app.use(compression());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/api/v1/", router);

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler);
}
