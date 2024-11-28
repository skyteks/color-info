import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "morgan";

import postgresRoutes from "./routes/postgres.routes";

dotenv.config();

const app: Express = express();
const port: Number = Number(process.env.PORT) || 3000;
const frontendUrl = process.env.ORIGIN || "http://localhost:5173";
const corsOptions = {
    credentials: true,
    origin: frontendUrl,
};

app.use(cors<Request>(corsOptions));
app.use(logger("dev"));
app.use(express.json());

app.use("/api", postgresRoutes);

app.get("/hello", (_request: Request, response: Response) => {
    response.send("<h1>Hello World</h1>");
});

app.get("*", (_request, response) => {
    response.status(404).json({ message: "Route does not exist." });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});