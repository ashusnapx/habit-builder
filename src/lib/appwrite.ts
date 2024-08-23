import { Client, Account, Databases } from "appwrite";

// Define the appwrite configuration interface
interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  subjectCollectionId: string;
  userCollectionId: string;
  chapterCollectionId: string;
}

// Create the appwrite configuration object
export const appwriteConfig: AppwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66c5f57e00340dfa6c61",
  databaseId: "66c5f67b00032c5ebca5",
  subjectCollectionId: "66c5f743000e8a7ed429",
  userCollectionId: "66c5f943002bfcbfc381",
  chapterCollectionId: "66c8be070035d6249e26",
};

// Initialize the client, account, and database objects
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);

// Function to sign up a user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const user = await account.create("unique()", email, password, name);
    console.log("User sign up:", user);
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Function to sign in a user
export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("User sign in session:", session);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Function to sign out a user
export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Function to fetch subjects
export const fetchSubjects = async () => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.subjectCollectionId
    );
    console.log("Fetched subjects:", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};
