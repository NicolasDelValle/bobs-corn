import { prisma } from "../lib/db";

export class ConfigService {
  private static cache: Map<string, string> = new Map();
  private static cacheExpiry = 5 * 60 * 1000;
  private static lastFetch = 0;

  static async get(key: string, defaultValue?: string): Promise<string | null> {
    await this.refreshCacheIfNeeded();
    return this.cache.get(key) || defaultValue || null;
  }

  static async getNumber(key: string, defaultValue?: number): Promise<number> {
    const value = await this.get(key, defaultValue?.toString());
    return value ? parseInt(value, 10) : defaultValue || 0;
  }

  static async getBoolean(
    key: string,
    defaultValue?: boolean
  ): Promise<boolean> {
    const value = await this.get(key, defaultValue?.toString());
    return value === "true";
  }

  static async set(
    key: string,
    value: string,
    description?: string
  ): Promise<void> {
    const data = description ? { value, description } : { value };

    await prisma.config.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    });

    this.cache.set(key, value);
  }

  private static async refreshCacheIfNeeded(): Promise<void> {
    const now = Date.now();
    if (now - this.lastFetch > this.cacheExpiry) {
      await this.refreshCache();
    }
  }

  private static async refreshCache(): Promise<void> {
    const configs = await prisma.config.findMany();
    this.cache.clear();

    for (const config of configs) {
      this.cache.set(config.key, config.value);
    }

    this.lastFetch = Date.now();
  }

  static async getTokenConfig() {
    return {
      accessTokenExpiry: await this.getNumber("jwt.access_token_minutes", 60),
      refreshTokenExpiry: await this.getNumber("jwt.refresh_token_days", 7),
    };
  }

  static async initializeDefaults(): Promise<void> {
    const defaults = [
      {
        key: "jwt.access_token_minutes",
        value: "60",
        description: "Duración del access token en minutos",
      },
      {
        key: "jwt.refresh_token_days",
        value: "7",
        description: "Duración del refresh token en días",
      },
    ];

    for (const config of defaults) {
      const exists = await prisma.config.findUnique({
        where: { key: config.key },
      });
      if (!exists) {
        await prisma.config.create({ data: config });
      }
    }

    await this.refreshCache();
  }
}
