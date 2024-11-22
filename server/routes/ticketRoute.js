import { Router } from "express";
import {
  createTicket,
  getUserTickets,
  getTicketCount,
} from "../controllers/ticketController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getUserTickets);
router.get("/count", authMiddleware, getTicketCount);
router.post("/create", authMiddleware, createTicket);

export default router;
