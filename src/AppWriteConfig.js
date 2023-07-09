import { Client, Databases } from "appwrite";

export const PROJECT_ID = process.env.PROJECT_ID;
export const DATABASE_ID = process.env.REACT_APP_DATABASE_ID;
export const COLLECTION_ID = process.env.REACT_APP_COLLECTION_ID;

const client = new Client();

client
  .setEndpoint(process.env.REACT_APP_ENDPOINT)
  .setProject(process.env.REACT_APP_PROJECT);

export const databases = new Databases(client);

export default client;
