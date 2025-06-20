import express, { Request, Response } from "express";
import * as dotenv from "dotenv"
import {path, __dirname} from "./utils/import_path.ts"

dotenv.config({path: path.join(__dirname, "../../.env")})

const app = express();

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")
app.set("views", [
    path.join(__dirname, "../../frontend/")
])

const port = process.env.PORT || 3000;
if (!process.env.PORT) {
    console.log("ENV not loaded")
}

import routes from "./routes/basic.route.ts"

app.use("/", routes)

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});