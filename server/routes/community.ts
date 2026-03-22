import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, extractToken } from "../lib/auth";

const prisma = new PrismaClient();

export const handleGetPosts: RequestHandler = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const posts = await prisma.communityPost.findMany({
      orderBy: { createdAt: "desc" },
      take: Math.min(parseInt(limit as string, 10), 100),
      skip: parseInt(offset as string, 10),
      include: {
        user: {
          select: {
            username: true,
            profile: { select: { displayName: true, avatar: true } },
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.json({
      success: true,
      posts: posts.map(post => ({
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        comments: post.comments.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString()
        }))
      })),
    });
  } catch (error) {
    console.error("Get posts error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleCreatePost: RequestHandler = async (req, res) => {
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

    const { title, content } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Title and content required" });
    }

    const post = await prisma.communityPost.create({
      data: {
        userId: payload.userId,
        title,
        content,
      },
      include: {
        user: {
          select: {
            username: true,
            profile: { select: { displayName: true, avatar: true } },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleGetPost: RequestHandler<{ postId: string }> = async (
  req,
  res
) => {
  try {
    const { postId } = req.params;

    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            username: true,
            profile: { select: { displayName: true, avatar: true } },
          },
        },
        comments: {
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                username: true,
                profile: { select: { displayName: true } },
              },
            },
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    return res.json({
      success: true,
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
        comments: post.comments.map(c => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString()
        }))
      },
    });
  } catch (error) {
    console.error("Get post error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleCreateComment: RequestHandler = async (req, res) => {
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

    const { postId, content } = req.body;

    if (!postId || !content) {
      return res
        .status(400)
        .json({ success: false, error: "Post ID and content required" });
    }

    const comment = await prisma.communityComment.create({
      data: {
        postId,
        userId: payload.userId,
        content,
      },
      include: {
        user: {
          select: {
            username: true,
            profile: { select: { displayName: true } },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      comment: {
        ...comment,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const handleLikePost: RequestHandler = async (req, res) => {
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

    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ success: false, error: "Post ID required" });
    }

    const post = await prisma.communityPost.update({
      where: { id: postId },
      data: { likes: { increment: 1 } },
    });

    return res.json({
      success: true,
      post: {
        ...post,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      },
    });
  } catch (error) {
    console.error("Like post error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
