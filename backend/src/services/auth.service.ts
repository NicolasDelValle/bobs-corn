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
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

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

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, config.security.jwtSecret) as JWTPayload;
  }

  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, config.security.jwtRefreshSecret) as JWTPayload;
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: any; tokens: TokenPair } | null> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, password: true },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    await prisma.session.updateMany({
      where: {
        userId: user.id,
        isRevoked: false,
      },
      data: { isRevoked: true },
    });

    const tokenConfig = await ConfigService.getTokenConfig();
    const expiresAt = new Date(
      Date.now() + tokenConfig.accessTokenExpiry * 60 * 1000
    );
    const refreshExpiresAt = new Date(
      Date.now() + tokenConfig.refreshTokenExpiry * 24 * 60 * 60 * 1000
    );

    const tempPayload: JWTPayload = {
      userId: user.id,
      sessionId: "temp",
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

    const payload: JWTPayload = {
      userId: user.id,
      sessionId: session.id,
      email: user.email,
    };

    const tokens = this.generateTokens(payload);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens,
    };
  }

  static async refreshTokens(refreshToken: string): Promise<TokenPair | null> {
    try {
      const payload = this.verifyRefreshToken(refreshToken);

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

      const newPayload: JWTPayload = {
        userId: session.user.id,
        sessionId: session.id,
        email: session.user.email,
      };

      const newTokens = this.generateTokens(newPayload);

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

  static async logout(sessionId: string): Promise<void> {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isRevoked: true },
    });
  }

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

  static async logoutAllSessions(userId: string): Promise<void> {
    await prisma.session.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

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
