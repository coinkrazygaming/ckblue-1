import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetChallenges: RequestHandler = async (req, res) => {
  try {
    // Create sample challenges if none exist
    const existingChallenges = await prisma.challenge.findMany();

    if (existingChallenges.length === 0) {
      await prisma.challenge.createMany({
        data: [
          {
            title: "Daily Grind",
            description: "Play 5 games today",
            icon: "📅",
            reward: 100,
            difficulty: "easy",
            duration: 24,
            requirement: "play_games",
            requirementValue: 5,
          },
          {
            title: "Lucky Break",
            description: "Win 3 games today",
            icon: "🍀",
            reward: 200,
            difficulty: "medium",
            duration: 24,
            requirement: "win_games",
            requirementValue: 3,
          },
          {
            title: "High Stakes",
            description: "Bet 5000 coins total today",
            icon: "💎",
            reward: 500,
            difficulty: "hard",
            duration: 24,
            requirement: "total_bets",
            requirementValue: 5000,
          },
          {
            title: "Weekly Champion",
            description: "Win 20 games this week",
            icon: "⭐",
            reward: 1000,
            difficulty: "hard",
            duration: 168,
            requirement: "win_games",
            requirementValue: 20,
          },
          {
            title: "Dice Master",
            description: "Win 10 Dice games",
            icon: "🎲",
            reward: 300,
            difficulty: "medium",
            duration: 72,
            requirement: "game_wins",
            requirementValue: 10,
          },
        ],
      });
    }

    const challenges = await prisma.challenge.findMany({
      where: { active: true },
    });

    return res.json({ success: true, challenges });
  } catch (error) {
    console.error("Get challenges error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetUserChallenges: RequestHandler = async (req, res) => {
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

    const userChallenges = await prisma.userChallenge.findMany({
      where: { userId: payload.userId },
      include: { challenge: true },
    });

    // If no challenges assigned, assign new ones
    if (userChallenges.length === 0) {
      const challenges = await prisma.challenge.findMany({
        where: { active: true },
        take: 5,
      });

      for (const challenge of challenges) {
        await prisma.userChallenge.create({
          data: {
            userId: payload.userId,
            challengeId: challenge.id,
          },
        });
      }

      const newUserChallenges = await prisma.userChallenge.findMany({
        where: { userId: payload.userId },
        include: { challenge: true },
      });

      return res.json({ success: true, challenges: newUserChallenges });
    }

    return res.json({ success: true, challenges: userChallenges });
  } catch (error) {
    console.error("Get user challenges error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleUpdateChallengeProgress: RequestHandler = async (
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

    const { challengeId, progress } = req.body;

    if (!challengeId || progress === undefined) {
      return res
        .status(400)
        .json({ success: false, error: "Challenge ID and progress required" });
    }

    const userChallenge = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId: payload.userId,
          challengeId,
        },
      },
      include: { challenge: true },
    });

    if (!userChallenge) {
      return res.status(404).json({ success: false, error: "Challenge not found" });
    }

    const isCompleted =
      progress >= userChallenge.challenge.requirementValue;

    const updated = await prisma.userChallenge.update({
      where: {
        userId_challengeId: {
          userId: payload.userId,
          challengeId,
        },
      },
      data: {
        progress: Math.min(progress, userChallenge.challenge.requirementValue),
        completed: isCompleted,
        completedAt: isCompleted ? new Date() : null,
      },
      include: { challenge: true },
    });

    // Award reward if completed
    if (isCompleted && !userChallenge.completed) {
      const wallet = await prisma.wallet.findUnique({
        where: { userId: payload.userId },
      });

      if (wallet) {
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            balance: wallet.balance + userChallenge.challenge.reward,
            totalEarned:
              wallet.totalEarned + userChallenge.challenge.reward,
          },
        });

        await prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: userChallenge.challenge.reward,
            type: "challenge_completed",
            description: `Challenge completed: ${userChallenge.challenge.title}`,
          },
        });
      }
    }

    return res.json({
      success: true,
      challenge: {
        ...updated,
        completedAt: updated.completedAt ? updated.completedAt.toISOString() : null
      },
    });
  } catch (error) {
    console.error("Update challenge progress error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
