import { Client, Account, Databases, Query } from "appwrite";
import { v4 as uuidv4 } from "uuid";

// Define the appwrite configuration interface
interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  subjectCollectionId: string;
  userCollectionId: string;
}

// Create the appwrite configuration object
export const appwriteConfig: AppwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "66c5f57e00340dfa6c61",
  databaseId: "66c5f67b00032c5ebca5",
  subjectCollectionId: "66c5f743000e8a7ed429",
  userCollectionId: "66c5f943002bfcbfc381",
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
    // Generate a UUID as the userId
    const userId = uuidv4();

    // Create the user with the generated userId
    const user = await account.create(userId, email, password, name);
    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Function to sign in a user
export const signIn = async (
  userId: string,
  email: string,
  password: string
) => {
  try {
    // Query to find a user by email
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("email", email)]
    );

    if (response.documents.length === 0) {
      throw new Error("User not found");
    }

    const user = response.documents[0];

    // Check if the password matches
    if (user.password !== password) {
      throw new Error("Invalid credentials");
    }

    // Create a session for the user
    const session = await account.createSession(email, password);
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
    return response.documents;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};
