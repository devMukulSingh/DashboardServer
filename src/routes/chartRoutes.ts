import { Router } from "express";
import { getChartDataController, getFilteredDataController } from "../controllers/ChartController";
import isAuthenticated from "../middlewares/auth";

const chartRouter = Router();

chartRouter.use(isAuthenticated)

chartRouter.get(`/get-chartdata`, getChartDataController);
chartRouter.get(`/get-filtereddata`, getFilteredDataController);


export default chartRouter;