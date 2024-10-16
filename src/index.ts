import express from "express";
import cors from "cors";
import chartRouter from "./routes/chartRoutes";
import { Express } from "express";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { base_url_client } from "./lib/utils";

const app: Express = express();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    credentials: true,
    origin: base_url_client,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/chart", chartRouter);
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
