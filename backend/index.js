import express from "express";
import { connectDatabase } from "./database/prismaClient.js";
import authRouter from "./authentication/auth.js";
import validate from "./authentication/validate.js";
import crud from "./user/crud.js";
import { withRetry } from "./ai/utils.js";

const app = express();

app.use((req, res, next) => {
     res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
     res.setHeader("Access-Control-Allow-Credentials", "true");
     if (req.method === "OPTIONS") return res.sendStatus(204);
     next();
});

app.use(express.json({ limit: "100mb" }));

app.use("/auth", authRouter);
app.use("/dashboard", validate, crud);

try {
     await withRetry(connectDatabase, {
          timeout: 10000,
          retries: 5,
          backoff: [1000, 5000, 10000, 20000, 60000],
          onRetry: (error, attempt) => {
               console.log(`Database connection attempt ${attempt} failed, retrying...`)
          }
     })
     app.listen(3000);
     console.log("Server listening on port 3000")
} catch (error) {
     console.error("Failed to connect to database after multiple attempts:", error.message)
     process.exit(1)
}
