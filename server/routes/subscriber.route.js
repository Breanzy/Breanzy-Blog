import express from "express";
import { subscribe, unsubscribe } from "../controllers/subscriber.controller.js";

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/unsubscribe", unsubscribe);

export default router;
