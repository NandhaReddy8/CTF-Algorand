import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from the .env file
config({ path: resolve(__dirname, ".env") });

// Export the mnemonic
export const myMnemonic = process.env.MNEMONIC as string;

