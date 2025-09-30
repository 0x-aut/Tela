import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

let authInstance: ReturnType<typeof betterAuth> | null = null;

function getAuthInstance() {
  if (!authInstance) {
    const runtimeConfig = useRuntimeConfig();

    if (!runtimeConfig.connection_string) {
      throw new Error("CONNECTION_STRING environment variable is not set");
    }

    if (!runtimeConfig.better_auth_secret) {
      throw new Error("BETTER_AUTH_SECRET environment variable is not set");
    }

    const client = new MongoClient(`${runtimeConfig.connection_string}`);
    const db = client.db("userAuthDocument");

    authInstance = betterAuth({
      database: mongodbAdapter(db),
      emailAndPassword: {
        enabled: true
      },
      secret: runtimeConfig.better_auth_secret
    });
  }

  return authInstance;
}

export const auth = new Proxy({} as ReturnType<typeof betterAuth>, {
  get(target, prop) {
    const instance = getAuthInstance();
    return instance[prop as keyof typeof instance];
  }
});