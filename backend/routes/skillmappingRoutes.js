import express from "express";
import {
  getMappings,
  createMapping,
  deleteMapping,
} from "../controllers/skillmappingController.js";

const router = express.Router();

router.get("/", getMappings);
router.post("/", createMapping);
router.delete("/:id", deleteMapping);

export default router;