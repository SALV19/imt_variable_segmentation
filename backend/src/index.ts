import express from "express";
import * as dotenv from "dotenv";
import { path, __dirname } from "./utils/import_path.ts";
import cookieSession from "cookie-session";
import "body-parser";

// Enviroment variables
dotenv.config({ path: path.join(__dirname, "../../.env") });

const app = express();

// Setup static files
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());

app.set("trust proxy", 1);
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET ?? "secret"],
    maxAge: 60 * 60 * 1000,
    secure: false,
    sameSite: "lax",
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
