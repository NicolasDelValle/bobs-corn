import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../lib/config";
import { prisma } from "../lib/db";
import { ConfigService } from "./config.service";

export interface JWTPayload {
  userId: string;
  sessionId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate tokens
  static generateTokens(payload: JWTPayload): TokenPair {
    const jwtSecret = config.security.jwtSecret;
    const jwtRefreshSecret = config.security.jwtRefreshSecret;

    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error("JWT secrets not configured");
    }

    try {
      const accessToken = jwt.sign({ ...payload }, jwtSecret);

      const refreshToken = jwt.sign({ ...payload }, jwtRefreshSecret);

      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Failed to generate tokens");
    }
  }

  // Verify access token
  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, config.security.jwtSecret) as JWTPayload;
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, config.security.jwtRefreshSecret) as JWTPayload;
  }

  // Login user
  static async login(
    email: string,
    password: string
  ): Promise<{ user: any; tokens: TokenPair } | null> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Invalidate all existing sessions for this user (single session per user)
    await prisma.session.updateMany({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    // Create session
    const tokenConfig = await ConfigService.getTokenConfig();
    const expiresAt = new Date(
      Date.now() + tokenConfig.accessTokenExpiry * 60 * 1000
    );
    const refreshExpiresAt = new Date(
      Date.now() + tokenConfig.refreshTokenExpiry * 24 * 60 * 60 * 1000
    );

    // Generate tokens first with temporary sessionId
    const tempPayload: JWTPayload = {
      userId: user.id,
      sessionId: "temp", // Will be updated after session creation
      email: user.email,
    };

    const tempTokens = this.generateTokens(tempPayload);

    const session = await prisma.session.create({
      data: {
        userId: user.id,
        accessToken: tempTokens.accessToken,
        refreshToken: tempTokens.refreshToken,
        expiresAt,
        refreshExpiresAt,
      },
    });

    // Generate final tokens with real sessionId
    const payload: JWTPayload = {
      userId: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const tokens = this.generateTokens(payload);

    // Update session with final tokens
    await prisma.session.update({
      where: { id: session.id },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  // Refresh tokens
  static async refreshTokens(refreshToken: string): Promise<TokenPair | null> {
    try {
      // Verify refresh token
      const payload = this.verifyRefreshToken(refreshToken);

      // Find session
      const session = await prisma.session.findFirst({
        where: {
          id: payload.sessionId,
          refreshToken,
          isRevoked: false,
          refreshExpiresAt: { gte: new Date() },
        },
        include: { user: true },
      });

      if (!session) {
        return null;
      }

      // Generate new tokens
      const newPayload: JWTPayload = {
        userId: session.user.id,
        sessionId: session.id,
        email: session.user.email,
      };

      const newTokens = this.generateTokens(newPayload);

      // Update session
      const tokenConfig = await ConfigService.getTokenConfig();
      const newExpiresAt = new Date(
        Date.now() + tokenConfig.accessTokenExpiry * 60 * 1000
      );
      const newRefreshExpiresAt = new Date(
        Date.now() + tokenConfig.refreshTokenExpiry * 24 * 60 * 60 * 1000
      );

      await prisma.session.update({
        where: { id: session.id },
        data: {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
          expiresAt: newExpiresAt,
          refreshExpiresAt: newRefreshExpiresAt,
        },
      });

      return newTokens;
    } catch (error) {
      return null;
    }
  }

  // Logout
  static async logout(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

  // Validate session
  static async validateSession(
    accessToken: string
  ): Promise<{ user: any; sessionId: string } | null> {
    try {
      const payload = this.verifyAccessToken(accessToken);

      const session = await prisma.session.findFirst({
        where: {
          id: payload.sessionId,
          accessToken,
          isRevoked: false,
          expiresAt: { gte: new Date() },
        },
        include: {
          user: {
            select: { id: true, email: true, name: true },
          },
        },
      });

      if (!session) {
        return null;
      }

      return {
        user: session.user,
        sessionId: session.id,
      };
    } catch (error) {
      return null;
    }
  }

  // Logout all sessions for a user
  static async logoutAllSessions(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  // Clean expired sessions (for cleanup jobs)
  static async cleanExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { refreshExpiresAt: { lt: new Date() } },
        ],
      },
    });

    return result.count;
  }
}
