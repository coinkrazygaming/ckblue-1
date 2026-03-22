import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetWallet: RequestHandler = async (req, res) => {
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

    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    return res.json({ success: true, wallet });
  } catch (error) {
    console.error("Get wallet error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetTransactions: RequestHandler = async (req, res) => {
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

    const { limit = 50, offset = 0 } = req.query;

    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    const transactions = await prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: "desc" },
      take: Math.min(parseInt(limit as string, 10), 100),
      skip: parseInt(offset as string, 10),
    });

    return res.json({
      success: true,
      transactions: transactions.map(t => ({
        ...t,
        createdAt: t.createdAt.toISOString()
      })),
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleDeposit: RequestHandler = async (req, res) => {
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

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    // Update wallet
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + amount,
        totalEarned: wallet.totalEarned + amount,
      },
    });

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount,
        type: "deposit",
        description: "Account deposit",
      },
    });

    return res.json({ success: true, wallet: updated });
  } catch (error) {
    console.error("Deposit error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleWithdraw: RequestHandler = async (req, res) => {
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

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Update wallet
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance - amount,
        totalSpent: wallet.totalSpent + amount,
      },
    });

    // Create transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -amount,
        type: "withdrawal",
        description: "Account withdrawal",
      },
    });

    return res.json({ success: true, wallet: updated });
  } catch (error) {
    console.error("Withdraw error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
