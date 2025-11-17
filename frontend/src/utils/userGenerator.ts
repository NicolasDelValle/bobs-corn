import { ANIMALS, SESSION_TYPES, ADJECTIVES } from "./const";

export const generateSessionName = (): string => {
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const randomType =
    SESSION_TYPES[Math.floor(Math.random() * SESSION_TYPES.length)];

  return `${randomAnimal} ${randomType}`;
};

export const generateAnimalUsername = (): string => {
  const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const randomAdjective =
    ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;

  return `${randomAdjective}${randomAnimal}${randomNumber}`;
};

export const generateAnimalSessionId = (): string => {
  const animalName = generateAnimalUsername();
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);

  return `${animalName}_${timestamp}_${randomSuffix}`;
};

export const getUsernameFromSessionId = (sessionId: string): string => {
  return sessionId.split("_")[0] || sessionId;
};

export const generateUserStats = (cornCount: number) => {
  const level = Math.floor(cornCount / 10) + 1;

  return {
    totalCorn: cornCount,
    level,
    nextLevelProgress: cornCount % 10,
    nextLevelTarget: 10,
  };
};
