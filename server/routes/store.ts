import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetStoreItems: RequestHandler = async (req, res) => {
  try {
    // Create sample store items if none exist
    const existingItems = await prisma.storeItem.findMany();

    if (existingItems.length === 0) {
      await prisma.storeItem.createMany({
        data: [
          {
            title: "Gold Avatar",
            description: "A shiny golden avatar frame",
            icon: "👑",
            price: 500,
            category: "cosmetics",
            type: "avatar",
            quantity: null,
          },
          {
            title: "2x Multiplier Boost",
            description: "Double your winnings for 1 hour",
            icon: "⚡",
            price: 1000,
            category: "boosts",
            type: "multiplier_boost",
            quantity: null,
          },
          {
            title: "Dark Theme",
            description: "Dark mode for your account",
            icon: "🌙",
            price: 300,
            category: "cosmetics",
            type: "theme",
            quantity: null,
          },
          {
            title: "Lucky Dice Theme",
            description: "Custom theme for Dice game",
            icon: "🎲",
            price: 250,
            category: "cosmetics",
            type: "game_theme",
            quantity: null,
          },
          {
            title: "Auto-Play Tool",
            description: "Automate your gameplay",
            icon: "🤖",
            price: 2000,
            category: "tools",
            type: "auto_play",
            quantity: null,
          },
          {
            title: "VIP Starter Pack",
            description: "Get 7 days of VIP benefits",
            icon: "💎",
            price: 5000,
            category: "boosts",
            type: "vip_starter",
            quantity: null,
          },
        ],
      });
    }

    const { category } = req.query;

    const items = await prisma.storeItem.findMany({
      where: {
        ...(category && { category: category as string }),
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json({ success: true, items });
  } catch (error) {
    console.error("Get store items error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleBuyItem: RequestHandler = async (req, res) => {
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

    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({ success: false, error: "Item ID required" });
    }

    // Get item
    const item = await prisma.storeItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    // Check quantity
    if (item.quantity && item.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: "Not enough inventory",
      });
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    const totalCost = item.price * quantity;

    if (wallet.balance < totalCost) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Update wallet
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance - totalCost,
        totalSpent: wallet.totalSpent + totalCost,
      },
    });

    // Record transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -totalCost,
        type: "purchase",
        description: `Purchased ${quantity}x ${item.title}`,
      },
    });

    // Add to inventory
    const existingInventory = await prisma.inventory.findUnique({
      where: {
        userId_itemId: {
          userId: payload.userId,
          itemId,
        },
      },
    });

    let inventory;
    if (existingInventory) {
      inventory = await prisma.inventory.update({
        where: {
          userId_itemId: {
            userId: payload.userId,
            itemId,
          },
        },
        data: {
          quantity: existingInventory.quantity + quantity,
        },
      });
    } else {
      inventory = await prisma.inventory.create({
        data: {
          userId: payload.userId,
          itemId,
          quantity,
        },
      });
    }

    return res.json({
      success: true,
      item: inventory,
      newBalance: wallet.balance - totalCost,
    });
  } catch (error) {
    console.error("Buy item error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetInventory: RequestHandler = async (req, res) => {
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

    const inventory = await prisma.inventory.findMany({
      where: { userId: payload.userId },
      include: { item: true },
      orderBy: { purchasedAt: "desc" },
    });

    return res.json({
      success: true,
      inventory: inventory.map(inv => ({
        ...inv,
        purchasedAt: inv.purchasedAt.toISOString(),
        expiresAt: inv.expiresAt ? inv.expiresAt.toISOString() : null
      })),
    });
  } catch (error) {
    console.error("Get inventory error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
