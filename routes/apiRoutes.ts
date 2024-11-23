import express from "express";
import { postQuote } from "../controller/api-controller";

const router = express.Router();
router.post("/quotes", postQuote);

export default router;
