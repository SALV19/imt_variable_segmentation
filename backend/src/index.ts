import express from "express";
import * as dotenv from "dotenv";
import { path, __dirname } from "./utils/import_path.ts";
// @ts-ignore
import session from "express-session";
import "express-session";
import "body-parser";

// Enviroment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Set up session
// @ts-ignore
declare module "express-session" {
  interface SessionData {
    [key: string]: any;
  }
}

const app = express();

// Setup static files
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  session({
    secret: "secret_string_temp",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up front-end folder
app.set("view engine", "ejs");
app.set("views", [path.join(__dirname, "../../frontend/views")]);

// Setup routes
import routes from "./routes/basic.route.ts";
import bodyParser from "body-parser";

app.use("/", routes);
app.get("", (req, res) => {
  res.status(404).send("Page not found");
});

// Start the Express server
const port = process.env.PORT || 3000;
if (!process.env.PORT) {
  console.log("ENV not loaded");
}

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});
