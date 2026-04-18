import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { db } from "./index";
import { logger } from "@/lib/logger";

logger.info("Running PostgreSQL migrations...");
await migrate(db as NodePgDatabase, { migrationsFolder: "./drizzle/pg" });
logger.info("Migrations complete.");
