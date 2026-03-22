import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePasswords,
  generateToken,
  verifyToken,
  extractToken,
} from "../lib/auth";

const prisma = new PrismaClient();

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

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    username: string;
    profile?: {
      displayName: string;
      avatar?: string;
      level: number;
    };
  };
  error?: string;
}

export const handleRegister: RequestHandler<
  {},
  AuthResponse,
  RegisterRequest
> = async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;

    if (!email || !username || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Email or username already exists",
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        profile: {
          create: {
            displayName,
          },
        },
        wallet: {
          create: {
            balance: 1000, // Starting balance
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: {
          displayName: user.profile?.displayName || "",
          avatar: user.profile?.avatar,
          level: user.profile?.level || 1,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleLogin: RequestHandler<
  {},
  AuthResponse,
  LoginRequest
> = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password required",
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check password
    const isValid = await comparePasswords(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: {
          displayName: user.profile?.displayName || "",
          avatar: user.profile?.avatar,
          level: user.profile?.level || 1,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleGetProfile: RequestHandler<
  {},
  any
> = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        profile: true,
        wallet: true,
        achievements: {
          include: { achievement: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile,
        wallet: user.wallet,
        achievements: user.achievements.map((ua) => ua.achievement),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const handleUpdateProfile: RequestHandler<
  {},
  any
> = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }

    const { displayName, avatar, bio, country } = req.body;

    const profile = await prisma.profile.update({
      where: { userId: payload.userId },
      data: {
        ...(displayName && { displayName }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(country && { country }),
      },
    });

    return res.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
