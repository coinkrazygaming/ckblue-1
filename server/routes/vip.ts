import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

const VIP_TIERS = {
  bronze: {
    cost: 500,
    bonusMultiplier: 1.1,
    monthlyBonus: 1000,
    durationDays: 30,
  },
  silver: {
    cost: 1500,
    bonusMultiplier: 1.25,
    monthlyBonus: 2500,
    durationDays: 30,
  },
  gold: {
    cost: 5000,
    bonusMultiplier: 1.5,
    monthlyBonus: 5000,
    durationDays: 30,
  },
  platinum: {
    cost: 10000,
    bonusMultiplier: 2,
    monthlyBonus: 10000,
    durationDays: 30,
  },
};

export const handleGetVIPInfo: RequestHandler = async (req, res) => {
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

    const vipMembership = await prisma.vIPMembership.findUnique({
      where: { userId: payload.userId },
    });

    return res.json({
      success: true,
      membership: vipMembership ? {
        ...vipMembership,
        joinedAt: vipMembership.joinedAt.toISOString(),
        expiresAt: vipMembership.expiresAt.toISOString()
      } : null,
      tiers: VIP_TIERS,
    });
  } catch (error) {
    console.error("Get VIP info error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleUpgradeVIP: RequestHandler = async (req, res) => {
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

    const { tier } = req.body;

    if (!tier || !VIP_TIERS[tier as keyof typeof VIP_TIERS]) {
      return res.status(400).json({ success: false, error: "Invalid tier" });
    }

    const tierData = VIP_TIERS[tier as keyof typeof VIP_TIERS];

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet || wallet.balance < tierData.cost) {
      return res.status(400).json({
        success: false,
        error: "Insufficient balance",
      });
    }

    // Deduct cost
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance - tierData.cost,
        totalSpent: wallet.totalSpent + tierData.cost,
      },
    });

    // Create or update VIP membership
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + tierData.durationDays);

    let membership = await prisma.vIPMembership.findUnique({
      where: { userId: payload.userId },
    });

    if (membership) {
      membership = await prisma.vIPMembership.update({
        where: { userId: payload.userId },
        data: {
          tier,
          expiresAt,
          bonusMultiplier: tierData.bonusMultiplier,
          monthlyBonus: tierData.monthlyBonus,
          isActive: true,
        },
      });
    } else {
      membership = await prisma.vIPMembership.create({
        data: {
          userId: payload.userId,
          tier,
          expiresAt,
          bonusMultiplier: tierData.bonusMultiplier,
          monthlyBonus: tierData.monthlyBonus,
          isActive: true,
        },
      });
    }

    // Record transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: -tierData.cost,
        type: "purchase",
        description: `VIP ${tier} membership upgrade`,
      },
    });

    return res.json({
      success: true,
      membership: {
        ...membership,
        joinedAt: membership.joinedAt.toISOString(),
        expiresAt: membership.expiresAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Upgrade VIP error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleClaimMonthlyBonus: RequestHandler = async (req, res) => {
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

    const membership = await prisma.vIPMembership.findUnique({
      where: { userId: payload.userId },
    });

    if (!membership || !membership.isActive) {
      return res.status(400).json({
        success: false,
        error: "No active VIP membership",
      });
    }

    // Get wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet) {
      return res.status(404).json({ success: false, error: "Wallet not found" });
    }

    // Add monthly bonus
    const updated = await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + membership.monthlyBonus,
        totalEarned: wallet.totalEarned + membership.monthlyBonus,
      },
    });

    // Record transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: membership.monthlyBonus,
        type: "vip_bonus",
        description: `VIP ${membership.tier} monthly bonus`,
      },
    });

    return res.json({
      success: true,
      wallet: updated,
      bonusAmount: membership.monthlyBonus,
    });
  } catch (error) {
    console.error("Claim monthly bonus error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
