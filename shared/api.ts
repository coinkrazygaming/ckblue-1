/**
 * Shared code between client and server
 * Useful to share types between client and server
 */

// Demo
export interface DemoResponse {
  message: string;
}

// Auth
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  profile?: {
    displayName: string;
    avatar?: string;
    level: number;
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Games
export interface Game {
  id: string;
  title: string;
  description: string;
  rules: string;
  icon: string;
  thumbnail: string;
  category: string;
  minBet: number;
  maxBet: number;
  houseFee: number;
  rtp: number;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: string;
  betAmount: number;
  winAmount: number;
  profit: number;
  result: "win" | "loss" | "tie";
  gameData?: any;
  createdAt: string;
}

export interface PlayGameRequest {
  gameId: string;
  betAmount: number;
  gameData?: any;
}

export interface PlayGameResponse {
  success: boolean;
  session?: GameSession;
  error?: string;
}

// Achievements
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  points: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  condition: string;
}

// Challenges
export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
  requirement: string;
  requirementValue: number;
  active: boolean;
}

export interface UserChallenge {
  id: string;
  challengeId: string;
  challenge?: Challenge;
  progress: number;
  completed: boolean;
  completedAt?: string;
}

// Leaderboard
export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  totalWins: number;
  totalEarnings: number;
  winRate: number;
  level: number;
  rank: number;
}

// Store
export interface StoreItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  category: string;
  type: string;
  quantity?: number;
}

export interface BuyItemRequest {
  itemId: string;
  quantity?: number;
}

export interface BuyItemResponse {
  success: boolean;
  item?: any;
  newBalance?: number;
  error?: string;
}

// Wallet
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

// Community
export interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
  comments?: CommunityComment[];
}

export interface CommunityComment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
}

// VIP
export interface VIPMembership {
  id: string;
  userId: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  joinedAt: string;
  expiresAt: string;
  isActive: boolean;
  bonusMultiplier: number;
  monthlyBonus: number;
}

// Referral
export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  reward: number;
  bonusPercentage: number;
  isActive: boolean;
  createdAt: string;
}

// Support
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  category: string;
  status: "open" | "in_progress" | "resolved";
  priority: "low" | "normal" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketRequest {
  subject: string;
  message: string;
  category: string;
  priority?: string;
}
