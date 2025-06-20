import * as path from "path"
import { fileURLToPath } from 'url';

// Emular __filename y __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename) + "/../";

export {path, __dirname}