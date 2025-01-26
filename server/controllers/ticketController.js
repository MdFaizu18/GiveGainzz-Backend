import Ticket from "../models/ticketModel.js";
import User from "../models/userModel.js";
import { v4 as uuidv4 } from "uuid";

export const initializeTicketsForUser = async (userId) => {
    try {
      await User.findByIdAndUpdate(
        userId,
        { ticketCount: 100 }, // Add ticket count field with value 3
        { new: true, upsert: true } // Create if doesn't exist
      );
    } catch (error) {
      console.error("Error initializing tickets for user:", error);
    }
  };

  export const createTicket = async (req, res) => {
    try {
      const {
        offerOrHelp,
        category,
        duration,
        location,
        description,
        ticketValid,
        hashtags,
        workMode,
        locationLink,
      } = req.body;
  
      const userId = req.body.userId; // Extract userId from the request body
  
      // Use async/await to handle Promises
      const user = await User.findById(userId);
  
      if (!user || user.ticketCount <= 0) {
        return res.status(400).json({ message: "No tickets available to use." });
      }
  
      const ticket = await Ticket.create({
        userId,
        ticketId: uuidv4(),
        offerOrHelp,
        category,
        duration,
        location,
        description,
        ticketValid,
        hashtags,
        workMode,
        locationLink,
      });
  
      user.ticketCount -= 1; // Deduct one ticket from the user's ticket count
      await user.save(); // Save the updated user document
  
      res.status(201).json({ message: "Ticket created successfully.", ticket });
    } catch (error) {
      console.error("Error creating ticket:", error);
      res.status(500).json({ message: "Error creating ticket." });
    }
  };
  
export const getUserTickets = async (req, res) => {
  try {
    const userId = req.userId;
    const tickets = await Ticket.find({ userId });
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching tickets." });
  }
};

export const getTicketCount = async (req, res) => {
  try {
    const { userId } = req.query; // Extract userId from query parameters
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the ticket count from the User model
    const user = await User.findById(userId, 'ticketCount'); // Only retrieve the ticketCount field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ ticketCount: user.ticketCount });
  } catch (error) {
    console.error("Error fetching ticket count:", error);
    res.status(500).json({ message: "Error fetching ticket count" });
  }
};
