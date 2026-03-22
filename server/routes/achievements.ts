import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetAchievements: RequestHandler = async (req, res) => {
  try {
    // Create sample achievements if none exist
    const existingAchievements = await prisma.achievement.findMany();

    if (existingAchievements.length === 0) {
      await prisma.achievement.createMany({
        data: [
          {
            title: "First Win",
            description: "Win your first game",
            icon: "🏆",
            badge: "first_win",
            points: 10,
            rarity: "common",
            condition: "Win 1 game",
          },
          {
            title: "Lucky Streak",
            description: "Win 5 games in a row",
            icon: "⚡",
            badge: "lucky_streak",
            points: 50,
            rarity: "rare",
            condition: "Win 5 consecutive games",
          },
          {
            title: "High Roller",
            description: "Bet 1000 coins in a single game",
            icon: "💰",
            badge: "high_roller",
            points: 100,
            rarity: "epic",
            condition: "Bet 1000 coins",
          },
          {
            title: "Millionaire",
            description: "Earn 1,000,000 coins total",
            icon: "🤑",
            badge: "millionaire",
            points: 500,
            rarity: "legendary",
            condition: "Earn 1,000,000 coins",
          },
          {
            title: "Game Master",
            description: "Play all games at least once",
            icon: "👑",
            badge: "game_master",
            points: 200,
            rarity: "epic",
            condition: "Play all games",
          },
          {
            title: "Community Hero",
            description: "Make 10 posts in the community",
            icon: "🦸",
            badge: "community_hero",
            points: 75,
            rarity: "rare",
            condition: "Make 10 posts",
          },
        ],
      });
    }

    const achievements = await prisma.achievement.findMany();
    return res.json({ success: true, achievements });
  } catch (error) {
    console.error("Get achievements error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetUserAchievements: RequestHandler = async (req, res) => {
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

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: payload.userId },
      include: { achievement: true },
      orderBy: { unlockedAt: "desc" },
    });

    return res.json({
      success: true,
      achievements: userAchievements.map(ua => ({
        ...ua.achievement,
        unlockedAt: ua.unlockedAt.toISOString()
      })),
    });
  } catch (error) {
    console.error("Get user achievements error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleUnlockAchievement: RequestHandler = async (req, res) => {
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

    const { achievementId } = req.body;

    if (!achievementId) {
      return res
        .status(400)
        .json({ success: false, error: "Achievement ID required" });
    }

    // Check if already unlocked
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: payload.userId,
          achievementId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        error: "Achievement already unlocked",
      });
    }

    // Create user achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: payload.userId,
        achievementId,
      },
      include: { achievement: true },
    });

    // Update user profile with points
    const profile = await prisma.profile.findUnique({
      where: { userId: payload.userId },
    });

    if (profile) {
      await prisma.profile.update({
        where: { userId: payload.userId },
        data: {
          level: Math.floor((profile.level * 100 + userAchievement.achievement.points) / 100),
        },
      });
    }

    return res.json({
      success: true,
      achievement: {
        ...userAchievement.achievement,
        unlockedAt: userAchievement.unlockedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Unlock achievement error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
