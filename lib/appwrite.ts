// lib/appwrite.ts
import { Account, Client, Databases } from 'appwrite';

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')  // ← real Appwrite endpoint
  .setProject('686723a7001216b697e7');               // ← your Project ID

export const account   = new Account(client);
export const databases = new Databases(client);