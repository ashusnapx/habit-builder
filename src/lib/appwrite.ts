import { Client, Account, Databases, Query } from "appwrite";

// Define the appwrite configuration interface
interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
  subjectCollectionId: string;
  userCollectionId: string;
  chapterCollectionId: string;
  targetCollectionId:string;
}

// Create the appwrite configuration object
export const appwriteConfig: AppwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "",
  subjectCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_SUBJECT_COLLECTION_ID || "",
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID || "",
  chapterCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_CHAPTER_COLLECTION_ID || "",
  targetCollectionId:
    process.env.NEXT_PUBLIC_APPWRITE_TARGET_COLLECTION_ID || "",
};

// Initialize the client, account, and database objects
const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const database = new Databases(client);

// Function to get the current user ID
export const getCurrentUserId = async () => {
  try {
    const session = await account.getSession("current");
    return session.userId;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

// Function to sign up a user
export const signUp = async (email: string, password: string, name: string) => {
  try {
    const user = await account.create("unique()", email, password, name);
    return user;
  } catch (error) {
    throw error;
  }
};

// Function to sign in a user
export const signIn = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw error;
  }
};

// Function to sign out a user
export const signOut = async () => {
  try {
    await account.deleteSession("current");
    window.location.reload();
  } catch (error) {
    throw error;
  }
};

// Function to fetch subjects
export const fetchSubjects = async () => {
  try {
    const userId = await getCurrentUserId(); // Get current user ID
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.subjectCollectionId,
      [Query.equal("user", userId)] // Filter subjects by user ID
    );
    console.log("Fetched subjects:", response.documents);
    return response.documents;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

// Function to fetch chapters
export const fetchChapters = async (subjectId: string) => {
  try {
    const response = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.chapterCollectionId,
      [Query.equal("subject", subjectId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }
};

export const createChapter = async (subjectId: string, title: string) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chapterCollectionId,
      "unique()",
      {
        title,
        completed: false,
        progress: 0,
        createdAt: new Date().toISOString(),
        subject: subjectId,
      }
    );
    console.log("Chapter created:", response);
    return response;
  } catch (error) {
    console.error("Error creating chapter:", error);
    throw error;
  }
};

// Function to update chapter progress
export const updateChapterProgress = async (
  chapterId: string,
  progress: number
) => {
  try {
    const response = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chapterCollectionId,
      chapterId,
      { progress }
    );
    console.log("Chapter progress updated:", response);
    return response;
  } catch (error) {
    console.error("Error updating chapter progress:", error);
    throw error;
  }
};

// Function to update chapter completion status
export const updateChapterCompletion = async (
  id: string,
  completed: boolean
) => {
  try {
    await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.chapterCollectionId,
      id,
      {
        completed,
        progress: completed ? 100 : 0,
      }
    );
  } catch (error) {
    console.error("Error updating chapter completion:", error);
    throw error;
  }
};

// Function to calculate subject progress
export const calculateSubjectProgress = (chapters: any[]) => {
  const totalChapters = chapters.length;
  const completedChapters = chapters.filter(
    (chapter) => chapter.completed
  ).length;
  return totalChapters === 0 ? 0 : (completedChapters / totalChapters) * 100;
};

// Function to update a subject
export const updateSubject = async (id: string, title: string) => {
  try {
    const response = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.subjectCollectionId,
      id,
      { title }
    );
    console.log("Subject updated:", response);
    return response;
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

// Function to delete a subject
export const deleteSubject = async (id: string) => {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.subjectCollectionId,
      id
    );
    console.log("Subject deleted:", id);
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }
};

export const createTarget = async (targetData: {
  chaptersPerDay: number;
  totalChapters: number;
  targetDate: string;
  createdAt: string;
  user: string;
}) => {
  try {
    const response = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.targetCollectionId,
      "unique()",
      targetData
    );
    console.log("Target created:", response);
    return response;
  } catch (error) {
    console.error("Error creating target:", error);
    throw error;
  }
};
