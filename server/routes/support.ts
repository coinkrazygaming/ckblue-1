import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

const FAQ_ITEMS = [
  {
    id: "1",
    question: "How do I withdraw my winnings?",
    answer:
      "You can withdraw your winnings through the Wallet section. Go to Wallet > Withdraw and enter the amount you want to withdraw. Your funds will be transferred within 24-48 hours.",
    category: "payment",
  },
  {
    id: "2",
    question: "What is the minimum bet?",
    answer:
      "The minimum bet varies by game. Most games have a minimum bet of 10-50 coins. Check the game details page for specific limits.",
    category: "games",
  },
  {
    id: "3",
    question: "How do I join the VIP club?",
    answer:
      "You can join the VIP club from the VIP Club section. Choose your tier (Bronze, Silver, Gold, or Platinum) and pay the membership fee. You'll get exclusive bonuses and rewards!",
    category: "vip",
  },
  {
    id: "4",
    question: "Can I play games on mobile?",
    answer:
      "Yes! Our platform is fully responsive and works on all mobile devices. Just visit our website from your mobile browser.",
    category: "general",
  },
  {
    id: "5",
    question: "How are my achievements earned?",
    answer:
      "Achievements are earned by completing specific tasks such as winning a certain number of games, reaching specific bet amounts, or playing for certain durations. Check the Achievements page to see all available achievements.",
    category: "achievements",
  },
  {
    id: "6",
    question: "What is the house edge?",
    answer:
      "The house edge varies by game. Most games have a house fee of 2-4% to keep the platform running. The RTP (Return to Player) is displayed on each game's information page.",
    category: "games",
  },
];

export const handleGetFAQ: RequestHandler = async (req, res) => {
  try {
    const { category } = req.query;

    const faq = category
      ? FAQ_ITEMS.filter(item => item.category === category)
      : FAQ_ITEMS;

    return res.json({ success: true, faq });
  } catch (error) {
    console.error("Get FAQ error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleCreateSupportTicket: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { subject, message, category, priority = "normal" } = req.body;

    if (!subject || !message || !category) {
      return res.status(400).json({
        success: false,
        error: "Subject, message, and category are required",
      });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: payload.userId,
        subject,
        message,
        category,
        priority,
      },
    });

    return res.status(201).json({
      success: true,
      ticket: {
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Create support ticket error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetSupportTickets: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { status, limit = 20, offset = 0 } = req.query;

    const tickets = await prisma.supportTicket.findMany({
      where: {
        userId: payload.userId,
        ...(status && { status: status as string }),
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(parseInt(limit as string, 10), 100),
      skip: parseInt(offset as string, 10),
    });

    return res.json({
      success: true,
      tickets: tickets.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString()
      })),
    });
  } catch (error) {
    console.error("Get support tickets error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetSupportTicket: RequestHandler<{ ticketId: string }> = async (
  req,
  res
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { ticketId } = req.params;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    if (ticket.userId !== payload.userId) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized access" });
    }

    return res.json({
      success: true,
      ticket: {
        ...ticket,
        createdAt: ticket.createdAt.toISOString(),
        updatedAt: ticket.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Get support ticket error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleUpdateSupportTicket: RequestHandler<{ ticketId: string }> = async (
  req,
  res
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { ticketId } = req.params;
    const { status, message } = req.body;

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, error: "Ticket not found" });
    }

    if (ticket.userId !== payload.userId) {
      return res
        .status(403)
        .json({ success: false, error: "Unauthorized access" });
    }

    const updated = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        ...(status && { status }),
        ...(message && { message }),
      },
    });

    return res.json({
      success: true,
      ticket: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Update support ticket error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
