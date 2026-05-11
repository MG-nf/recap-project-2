import { Router } from "express";
import * as apiTrailController from "../controllers/apiTrailController";
import * as apiRegionController from "../controllers/apiRegionController";

const apiRouter = Router();

apiRouter.get("/trails", apiTrailController.fetchTrails); // todo: optional ?region=<slug> and ?difficulty=<easy|moderate|hard> filters via req.query
apiRouter.get("/trails/:slug", apiTrailController.fetchTrailBySlug);
apiRouter.get("/regions", apiRegionController.fetchRegions);
apiRouter.get("/regions/:slug/trails", apiTrailController.fetchTrailsByRegion);
apiRouter.post("/api/trails", apiTrailController.createTrail);
apiRouter.patch("/trails/:id", apiTrailController.editTrail);
apiRouter.delete("/trails/:id", apiTrailController.removeTrail);

export default apiRouter;