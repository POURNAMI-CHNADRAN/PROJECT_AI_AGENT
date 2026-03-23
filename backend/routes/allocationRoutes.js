import express from "express";
import { getAll, create, getByEmployee, remove } from "../controllers/allocationController.js";

const router = express.Router();

router.get("/", getAll);
router.post("/", create);
router.get("/employee/:id", getByEmployee);
router.delete("/:id", remove);

export default router;