import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const runtimeConfig = useRuntimeConfig();
console.log(runtimeConfig.connection_string)

if (!runtimeConfig.connection_string) {
  throw new Error("CONNECTION_STRING environment variable is not set");
}

if (!runtimeConfig.better_auth_secret) {
  throw new Error("BETTER_AUTH_SECRET environment variable is not set");
}

const client = new MongoClient(`${runtimeConfig.connection_string}`);
const db = client.db("userAuthDocument");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  secret: runtimeConfig.better_auth_secret
});