import cron from "node-cron";
import {
  cleanupOldRateLimits,
  cleanupOldClients,
} from "../services/cleanup.service";

export function startCleanupJobs() {
  cron.schedule("0 3 * * *", async () => {
    console.log("Running rate limit cleanup...");
    try {
      const deletedCount = await cleanupOldRateLimits(7);
      console.log(`Cleaned up ${deletedCount} old rate limit records`);
    } catch (error) {
      console.error("Rate limit cleanup failed:", error);
    }
  });

  cron.schedule("0 4 * * 0", async () => {
    console.log("Running inactive clients cleanup...");
    try {
      const deletedCount = await cleanupOldClients(30);
      console.log(`Cleaned up ${deletedCount} inactive clients`);
    } catch (error) {
      console.error("Client cleanup failed:", error);
    }
  });

  console.log("Cleanup jobs scheduled");
  console.log("  - Rate limits: Daily at 3 AM");
  console.log("  - Inactive clients: Sundays at 4 AM");
}

export function stopCleanupJobs() {
  cron.getTasks().forEach((task) => task.stop());
  console.log("Cleanup jobs stopped");
}
