import express, { Request, Response } from "express";
import path from "path"
import { fileURLToPath } from "url";
import * as dotenv from "dotenv"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: path.join(__dirname, "../../.env")})

const app = express();

const port = process.env.PORT || 3000;

import routes from "./routes/basic.route"

app.use("/", routes)

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});