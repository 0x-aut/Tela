import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";


const runtimeConfig = useRuntimeConfig();


const client = new MongoClient(`${runtimeConfig.connection_string}`);
const db = client.db("userAuthDocument");

var secret_key = `${runtimeConfig.better_auth_secret}`;

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true
  },
  secret: secret_key
});