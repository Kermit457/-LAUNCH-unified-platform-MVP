import { Client, Databases } from 'node-appwrite'

// Server-side Appwrite client with API key
export const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
  .setKey(process.env.APPWRITE_API_KEY || '') // Server-side API key

export const serverDatabases = new Databases(serverClient)

// Re-export DB_ID and COLLECTIONS from client
export { DB_ID, COLLECTIONS } from './client'
