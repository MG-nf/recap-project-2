import { Router } from "express";
import * as adminController from "../controllers/adminController"

const adminRouter = Router();

adminRouter.get("/", adminController.listTrails);
adminRouter.get("/trails/new", adminController.newTrail);
adminRouter.post("/trails", adminController.saveNewTrail);
adminRouter.get("/trails/:id/edit", adminController.editTrail);
adminRouter.post("/trails/:id", adminController.saveUpdatedTrail);
adminRouter.post("/trails/:id/delete", adminController.removeTrail);


export default adminRouter;