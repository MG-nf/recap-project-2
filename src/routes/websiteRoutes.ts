import { Router } from "express";
import * as trailController from "../controllers/trailController";
import * as regionController from "../controllers/regionController";

const websiteRouter = Router();

websiteRouter.get("/", trailController.listTrails);
websiteRouter.get("/trails/:slug", trailController.showTrail);
websiteRouter.get("/regions", regionController.listRegions);
websiteRouter.get("/regions/:slug", regionController.showRegion);

export default websiteRouter;