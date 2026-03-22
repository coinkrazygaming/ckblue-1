import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleRegister,
  handleLogin,
  handleGetProfile,
  handleUpdateProfile,
} from "./routes/auth";
import {
  handleGetGames,
  handleGetGame,
  handlePlayGame,
  handleGetGameSessions,
} from "./routes/games";
import { handleGetLeaderboards, handleGetUserRank } from "./routes/leaderboards";
import {
  handleGetAchievements,
  handleGetUserAchievements,
  handleUnlockAchievement,
} from "./routes/achievements";
import {
  handleGetChallenges,
  handleGetUserChallenges,
  handleUpdateChallengeProgress,
} from "./routes/challenges";
import {
  handleGetWallet,
  handleGetTransactions,
  handleDeposit,
  handleWithdraw,
} from "./routes/wallet";
import {
  handleGetStoreItems,
  handleBuyItem,
  handleGetInventory,
} from "./routes/store";
import {
  handleGetPosts,
  handleCreatePost,
  handleGetPost,
  handleCreateComment,
  handleLikePost,
} from "./routes/community";
import {
  handleGetVIPInfo,
  handleUpgradeVIP,
  handleClaimMonthlyBonus,
} from "./routes/vip";
import {
  handleGetReferralCode,
  handleGetReferralStats,
  handleCreateReferral,
} from "./routes/referrals";
import {
  handleGetFAQ,
  handleCreateSupportTicket,
  handleGetSupportTickets,
  handleGetSupportTicket,
  handleUpdateSupportTicket,
} from "./routes/support";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.get("/api/auth/profile", handleGetProfile);
  app.put("/api/auth/profile", handleUpdateProfile);

  // Games routes
  app.get("/api/games", handleGetGames);
  app.get("/api/games/:gameId", handleGetGame);
  app.post("/api/games/play", handlePlayGame);
  app.get("/api/games/sessions", handleGetGameSessions);

  // Leaderboards routes
  app.get("/api/leaderboards", handleGetLeaderboards);
  app.get("/api/leaderboards/:userId", handleGetUserRank);

  // Achievements routes
  app.get("/api/achievements", handleGetAchievements);
  app.get("/api/achievements/user", handleGetUserAchievements);
  app.post("/api/achievements/unlock", handleUnlockAchievement);

  // Challenges routes
  app.get("/api/challenges", handleGetChallenges);
  app.get("/api/challenges/user", handleGetUserChallenges);
  app.post("/api/challenges/progress", handleUpdateChallengeProgress);

  // Wallet routes
  app.get("/api/wallet", handleGetWallet);
  app.get("/api/wallet/transactions", handleGetTransactions);
  app.post("/api/wallet/deposit", handleDeposit);
  app.post("/api/wallet/withdraw", handleWithdraw);

  // Store routes
  app.get("/api/store", handleGetStoreItems);
  app.post("/api/store/buy", handleBuyItem);
  app.get("/api/inventory", handleGetInventory);

  // Community routes
  app.get("/api/community/posts", handleGetPosts);
  app.post("/api/community/posts", handleCreatePost);
  app.get("/api/community/posts/:postId", handleGetPost);
  app.post("/api/community/comments", handleCreateComment);
  app.post("/api/community/like", handleLikePost);

  // VIP routes
  app.get("/api/vip", handleGetVIPInfo);
  app.post("/api/vip/upgrade", handleUpgradeVIP);
  app.post("/api/vip/claim-bonus", handleClaimMonthlyBonus);

  // Referrals routes
  app.get("/api/referrals/code", handleGetReferralCode);
  app.get("/api/referrals/stats", handleGetReferralStats);
  app.post("/api/referrals", handleCreateReferral);

  // Support routes
  app.get("/api/support/faq", handleGetFAQ);
  app.post("/api/support/tickets", handleCreateSupportTicket);
  app.get("/api/support/tickets", handleGetSupportTickets);
  app.get("/api/support/tickets/:ticketId", handleGetSupportTicket);
  app.put("/api/support/tickets/:ticketId", handleUpdateSupportTicket);

  return app;
}
