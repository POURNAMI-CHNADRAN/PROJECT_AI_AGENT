import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  getByEmployee,
  getByProject
} from "../controllers/timesheetController.js";

const router = express.Router();

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", update);

router.get("/employee/:id", getByEmployee);
router.get("/project/:id", getByProject);

export default router;