import { Router } from "express";
import {
  createTicket,
  getUserTickets,
  getTicketCount,
} from "../controllers/ticketController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getUserTickets);
router.get("/count", getTicketCount);
router.post("/create", createTicket);

export default router;
