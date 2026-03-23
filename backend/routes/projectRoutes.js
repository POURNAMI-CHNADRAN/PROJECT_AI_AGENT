import express from "express";
import { getAll, getOne, create, update, remove } from "../controllers/projectController.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;