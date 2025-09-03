import express from "express";
import cors from "cors";
import GamesRouter from "./routes/games";
import errorHandler from "./middleware/errorHandler";

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/games",GamesRouter);
app.use(errorHandler);

app.listen(process.env.PORT || 3001);
