import { Client, Databases, Users, Storage } from 'node-appwrite'

// Validate server environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
const apiKey = process.env.APPWRITE_API_KEY

if (!endpoint || !projectId || !apiKey) {
  throw new Error(
    'Missing Appwrite server environment variables. Please check your .env file.'
  )
}

// Server-side Appwrite client (with API key for admin operations)
export const serverClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey)

// Server service instances
export const serverDatabases = new Databases(serverClient)
export const serverUsers = new Users(serverClient)
export const serverStorage = new Storage(serverClient)

// Re-export shared constants
export { DB_ID, COLLECTIONS, BUCKETS } from './client'