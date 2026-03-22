import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetGames: RequestHandler = async (req, res) => {
  try {
    // Get or create sample games if none exist
    const existingGames = await prisma.game.findMany();

    if (existingGames.length === 0) {
      // Create sample games
      await prisma.game.createMany({
        data: [
          {
            title: "Lucky Dice",
            description: "Roll the dice and get lucky!",
            rules:
              "Bet on your lucky number and roll the dice. Match the number to win!",
            icon: "🎲",
            thumbnail: "https://via.placeholder.com/300x200?text=Lucky+Dice",
            category: "dice",
            minBet: 10,
            maxBet: 1000,
            houseFee: 0.02,
            rtp: 0.97,
          },
          {
            title: "Coin Flip",
            description: "Simple heads or tails",
            rules: "Bet on heads or tails. 50/50 chance to win!",
            icon: "🪙",
            thumbnail:
              "https://via.placeholder.com/300x200?text=Coin+Flip",
            category: "arcade",
            minBet: 10,
            maxBet: 500,
            houseFee: 0.03,
            rtp: 0.98,
          },
          {
            title: "Lucky Cards",
            description: "Pick a winning card",
            rules:
              "Choose a card from the deck. Higher card wins! Face cards are worth more.",
            icon: "🃏",
            thumbnail:
              "https://via.placeholder.com/300x200?text=Lucky+Cards",
            category: "cards",
            minBet: 20,
            maxBet: 2000,
            houseFee: 0.025,
            rtp: 0.96,
          },
          {
            title: "Spin the Wheel",
            description: "Spin and win big",
            rules:
              "Spin the wheel of fortune! Different segments have different multipliers.",
            icon: "🎡",
            thumbnail:
              "https://via.placeholder.com/300x200?text=Spin+Wheel",
            category: "slots",
            minBet: 5,
            maxBet: 500,
            houseFee: 0.04,
            rtp: 0.95,
          },
          {
            title: "Blackjack",
            description: "Beat the dealer",
            rules:
              "Get closer to 21 than the dealer without going over. Hit, stand, or split!",
            icon: "♠️",
            thumbnail: "https://via.placeholder.com/300x200?text=Blackjack",
            category: "cards",
            minBet: 50,
            maxBet: 5000,
            houseFee: 0.015,
            rtp: 0.99,
          },
          {
            title: "Roulette",
            description: "European roulette",
            rules:
              "Bet on a number or color. Spin the wheel and see if it lands on your choice!",
            icon: "🎰",
            thumbnail: "https://via.placeholder.com/300x200?text=Roulette",
            category: "slots",
            minBet: 10,
            maxBet: 1000,
            houseFee: 0.027,
            rtp: 0.973,
          },
        ],
      });
    }

    const games = await prisma.game.findMany();
    return res.json({ success: true, games });
  } catch (error) {
    console.error("Get games error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetGame: RequestHandler<{ gameId: string }> = async (
  req,
  res
) => {
  try {
    const { gameId } = req.params;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }

    // Get game statistics
    const sessions = await prisma.gameSession.findMany({
      where: { gameId },
    });

    const totalBets = sessions.reduce((sum, s) => sum + s.betAmount, 0);
    const totalWinnings = sessions.reduce((sum, s) => sum + s.winAmount, 0);
    const winCount = sessions.filter((s) => s.result === "win").length;

    return res.json({
      success: true,
      game,
      stats: {
        totalPlays: sessions.length,
        totalBets,
        totalWinnings,
        winRate: sessions.length > 0 ? winCount / sessions.length : 0,
      },
    });
  } catch (error) {
    console.error("Get game error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handlePlayGame: RequestHandler = async (req, res) => {
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

    const { gameId, betAmount, gameData } = req.body;

    if (!gameId || !betAmount || betAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid bet amount" });
    }

    // Get game
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return res.status(404).json({ success: false, error: "Game not found" });
    }

    // Validate bet
    if (betAmount < game.minBet || betAmount > game.maxBet) {
      return res
        .status(400)
        .json({ success: false, error: "Bet amount out of range" });
    }

    // Get user wallet
    const wallet = await prisma.wallet.findUnique({
      where: { userId: payload.userId },
    });

    if (!wallet || wallet.balance < betAmount) {
      return res
        .status(400)
        .json({ success: false, error: "Insufficient balance" });
    }

    // Simulate game result (simple random win/loss)
    const winProbability = game.rtp;
    const isWin = Math.random() < winProbability;
    const multiplier = isWin
      ? 1.5 + Math.random() * 2
      : 0;
    const winAmount = isWin ? betAmount * multiplier : 0;
    const profit = winAmount - betAmount;

    // Update wallet
    const newBalance = wallet.balance - betAmount + winAmount;
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance,
        totalEarned: wallet.totalEarned + (winAmount > 0 ? winAmount : 0),
        totalSpent: wallet.totalSpent + betAmount,
      },
    });

    // Record game session
    const session = await prisma.gameSession.create({
      data: {
        userId: payload.userId,
        gameId,
        betAmount,
        winAmount,
        profit,
        result: isWin ? "win" : "loss",
        gameData,
      },
    });

    // Create wallet transaction
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        amount: profit,
        type: isWin ? "game_win" : "game_loss",
        description: `${game.title} - ${isWin ? "Won" : "Lost"}`,
      },
    });

    // Update profile stats
    await prisma.profile.update({
      where: { userId: payload.userId },
      data: {
        totalGamesPlayed: { increment: 1 },
        ...(isWin && { totalWins: { increment: 1 } }),
        ...(!isWin && { totalLosses: { increment: 1 } }),
      },
    });

    return res.json({
      success: true,
      session: {
        ...session,
        createdAt: session.createdAt.toISOString(),
      },
      newBalance,
    });
  } catch (error) {
    console.error("Play game error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetGameSessions: RequestHandler = async (req, res) => {
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

    const { gameId } = req.query;
    const limit = parseInt((req.query.limit as string) || "20", 10);
    const offset = parseInt((req.query.offset as string) || "0", 10);

    const sessions = await prisma.gameSession.findMany({
      where: {
        userId: payload.userId,
        ...(gameId && { gameId: gameId as string }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return res.json({ success: true, sessions: sessions.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString()
    })) });
  } catch (error) {
    console.error("Get game sessions error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
