import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const runtimeConfig = useRuntimeConfig();

const client = new MongoClient(`${runtimeConfig.connection_string}`);
const db = client.db("userAuthDocument");

const secret_key: String = `${runtimeConfig.better_auth_secret}`;
// if (!secret_key) {
//   secret_key = process.env.BETTER_AUTH_SECRET
// }

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
});