import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleGetLeaderboards: RequestHandler = async (req, res) => {
  try {
    const { sortBy = "totalWins", limit = 100 } = req.query;

    const profiles = await prisma.profile.findMany({
      orderBy: {
        [sortBy as string]: "desc",
      },
      take: Math.min(parseInt(limit as string, 10), 100),
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
      },
    });

    // Calculate rankings
    const leaderboard = profiles.map((profile, index) => ({
      id: profile.id,
      userId: profile.userId,
      username: profile.user.username,
      displayName: profile.displayName,
      avatar: profile.avatar,
      totalWins: profile.totalWins,
      totalEarnings: 0, // TODO: calculate from wallet transactions
      winRate: profile.totalGamesPlayed > 0
        ? (profile.totalWins / profile.totalGamesPlayed) * 100
        : 0,
      level: profile.level,
      rank: index + 1,
      totalGamesPlayed: profile.totalGamesPlayed,
    }));

    return res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Get leaderboards error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetUserRank: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const userProfile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Count how many users have more wins
    const higherRankedCount = await prisma.profile.count({
      where: {
        totalWins: {
          gt: userProfile.totalWins,
        },
      },
    });

    return res.json({
      success: true,
      rank: {
        userId,
        username: userProfile.user.username,
        displayName: userProfile.displayName,
        totalWins: userProfile.totalWins,
        totalGamesPlayed: userProfile.totalGamesPlayed,
        winRate: userProfile.totalGamesPlayed > 0
          ? (userProfile.totalWins / userProfile.totalGamesPlayed) * 100
          : 0,
        level: userProfile.level,
        rank: higherRankedCount + 1,
      },
    });
  } catch (error) {
    console.error("Get user rank error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
