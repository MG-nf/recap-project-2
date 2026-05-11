import express from "express";
import nunjucks from "nunjucks";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB, closeDB } from "./models/db";
import websiteRouter from "./routes/websiteRoutes";
import adminRouter from "./routes/adminRoutes";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use("/", websiteRouter);
app.use("/admin", adminRouter);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");
const viewsDir = path.join(projectRoot, "views");

nunjucks.configure(viewsDir, { autoescape: true, express: app });

app.set("view engine", "html");
app.set("views", viewsDir);
app.use("/public", express.static(publicDir));

await connectDB();

const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing database connection...");
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing database connection...");
  await closeDB();
  process.exit(0);
});