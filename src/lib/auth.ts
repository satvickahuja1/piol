import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import 'dotenv/config'
import { db } from "@/drizzle";
import * as schema from '../drizzle/schema'

export const auth = betterAuth(
    {
        database: drizzleAdapter(db, {
            provider: "pg",
            schema
        }),
        emailAndPassword: {
            enabled: true
        },

    }
);