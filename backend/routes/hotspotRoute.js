import express from "express";

import { authMiddleware } from "../middleware/middleware.js";

import * as hotspotController from "../controllers/product/productHotspot.controller.js";

const hotspotRouter = express.Router();

hotspotRouter.post(
  "/create-hotspot",
  authMiddleware,
  hotspotController.createHotspot
);

hotspotRouter.get(
  "/variant/:variantId",
  hotspotController.getHotspots
);

hotspotRouter.get(
  "/:id",
  hotspotController.getHotspot
);

hotspotRouter.put(
  "/update/:id",
  authMiddleware,
  hotspotController.updateHotspot
);

hotspotRouter.delete(
  "/delete/:id",
  authMiddleware,
  hotspotController.deleteHotspot
);

hotspotRouter.patch(
  "/reorder",
  authMiddleware,
  hotspotController.reorderHotspots
);

export default hotspotRouter;