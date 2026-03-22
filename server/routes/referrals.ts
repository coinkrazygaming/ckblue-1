import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetReferralCode: RequestHandler = async (req, res) => {
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

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Use a simple encoding of user ID as referral code
    const referralCode = Buffer.from(user.id).toString("base64").substring(0, 8);

    return res.json({
      success: true,
      referralCode,
      userId: user.id,
    });
  } catch (error) {
    console.error("Get referral code error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetReferralStats: RequestHandler = async (req, res) => {
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

    const referrals = await prisma.referral.findMany({
      where: { referrerId: payload.userId },
    });

    const totalEarned = referrals.reduce(
      (sum, ref) => sum + (ref.isActive ? ref.reward : 0),
      0
    );

    return res.json({
      success: true,
      stats: {
        totalReferrals: referrals.length,
        activeReferrals: referrals.filter(r => r.isActive).length,
        totalEarned,
        referrals: referrals.map(ref => ({
          ...ref,
          createdAt: ref.createdAt.toISOString()
        })),
      },
    });
  } catch (error) {
    console.error("Get referral stats error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleCreateReferral: RequestHandler = async (req, res) => {
  try {
    const { referralCode } = req.body;

    if (!referralCode) {
      return res
        .status(400)
        .json({ success: false, error: "Referral code required" });
    }

    // Decode referral code to get user ID
    const referrerId = Buffer.from(referralCode, "base64").toString().substring(0, 24);

    const referrer = await prisma.user.findUnique({
      where: { id: referrerId },
    });

    if (!referrer) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid referral code" });
    }

    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Check if already referred
    const existing = await prisma.referral.findUnique({
      where: {
        referrerId_refereeId: {
          referrerId,
          refereeId: payload.userId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Already referred by this user",
      });
    }

    // Create referral
    const referral = await prisma.referral.create({
      data: {
        referrerId,
        refereeId: payload.userId,
        reward: 100,
        bonusPercentage: 0.1,
      },
    });

    // Award referrer bonus
    const referrerWallet = await prisma.wallet.findUnique({
      where: { userId: referrerId },
    });

    if (referrerWallet) {
      await prisma.wallet.update({
        where: { id: referrerWallet.id },
        data: {
          balance: referrerWallet.balance + 100,
          totalEarned: referrerWallet.totalEarned + 100,
        },
      });

      await prisma.walletTransaction.create({
        data: {
          walletId: referrerWallet.id,
          amount: 100,
          type: "referral",
          description: "Referral bonus for new user",
        },
      });
    }

    // Award referee bonus
    const refereeWallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (refereeWallet) {
      await prisma.wallet.update({
        where: { id: refereeWallet.id },
        data: {
          balance: refereeWallet.balance + 50,
          totalEarned: refereeWallet.totalEarned + 50,
        },
      });

      await prisma.walletTransaction.create({
        data: {
          walletId: refereeWallet.id,
          amount: 50,
          type: "referral",
          description: "Referral bonus for joining",
        },
      });
    }

    return res.status(201).json({
      success: true,
      referral: {
        ...referral,
        createdAt: referral.createdAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Create referral error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
