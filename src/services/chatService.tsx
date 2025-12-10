import { db } from "@/firebase/firebaseClient";
import { collections } from "@/firebase/paths";
import { logger } from "@/utils/logger";
import { ChatDetail } from "@/types/chat";
import { Message } from "@/zustand/useChatStore";
import {
  addDoc,
  collection,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const COLLECTION_NAME = collections.PROMPTME_CHATS;

// Helper function to serialize messages
const serializeMessages = (messages: Message[]): string | null => {
  try {
    return JSON.stringify(messages);
  } catch (error) {
    logger.error("Failed to serialize messages", error);
    return null;
  }
};

// Helper function to handle Firestore errors
const handleFirestoreError = (error: unknown, message: string): void => {
  if (error instanceof Error) {
    logger.error(`${message}: ${error.message}`);
  } else {
    logger.error(`${message}: An unexpected error occurred`);
  }
};

// Function to save a new chat
export async function saveChat(
  userId: string,
  fullName: string,
  messages: Message[]
): Promise<ChatDetail | undefined> {
  const chatData = serializeMessages(messages);
  if (!chatData) return;

  const chatName = messages[0]?.userMessage?.content || "Default Chat Name";

  try {
    const chatRef = await addDoc(
      collection(db, COLLECTION_NAME, userId, collections.CHAT),
      {
        userId,
        fullName,
        timestamp: serverTimestamp(),
        chat: chatData,
        name: chatName,
      }
    );

    // Get the document object after adding it
    const docSnap = await getDoc(chatRef);

    if (docSnap.exists()) {
      const chatDetail: ChatDetail = {
        id: docSnap.id,
        name: docSnap.data().name,
        timestamp: docSnap.data().timestamp,
      };

      return chatDetail;
    }
  } catch (error) {
    handleFirestoreError(error, "Error saving chat");
  }
}

// Function to update an existing chat
export async function updateChat(
  userId: string,
  chatId: string,
  messages: Message[]
): Promise<void> {
  const chatData = serializeMessages(messages);
  if (!chatData) return;

  try {
    await updateDoc(
      doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId),
      {
        docId: chatId,
        timestamp: serverTimestamp(),
        chat: chatData,
      }
    );
  } catch (error) {
    handleFirestoreError(error, "Error updating chat");
  }
}

// Function to get a chat by ID
export async function getChat(
  userId: string,
  chatId: string
): Promise<{ chat: Message[] } | null> {
  try {
    const chatRef = doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId);
    const docSnap = await getDoc(chatRef);

    if (docSnap.exists()) {
      const chatData = docSnap.data().chat;
      try {
        const parsedMessages: Message[] = JSON.parse(chatData);
        return { ...docSnap.data(), chat: parsedMessages };
      } catch (error) {
        handleFirestoreError(error, "Failed to parse chat data");
        return null;
      }
    } else {
      logger.warn(`No chat found with ID: ${chatId}`);
      return null;
    }
  } catch (error) {
    handleFirestoreError(error, "Error getting chat");
    return null;
  }
}

// Function to get all chat details
export async function getAllChatDetails(userId: string): Promise<ChatDetail[]> {
  try {
    const chatsRef = collection(db, COLLECTION_NAME, userId, collections.CHAT);
    const querySnapshot = await getDocs(chatsRef);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || "Unnamed Chat",
      timestamp: doc.data().timestamp,
      pinned: doc.data().pinned,
    }));
  } catch (error) {
    handleFirestoreError(error, "Error getting chat details");
    return [];
  }
}

// Function to update chat name
export async function updateChatName(
  userId: string,
  chatId: string,
  name: string
): Promise<boolean> {
  try {
    await updateDoc(
      doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId),
      {
        docId: chatId,
        timestamp: serverTimestamp(),
        name: name,
      }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, "Error updating chat name");
    return false;
  }
}

// Function to pin chat
export async function pinChat(
  userId: string,
  chatId: string
): Promise<boolean> {
  try {
    await updateDoc(
      doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId),
      {
        timestamp: serverTimestamp(),
        pinned: true,
      }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, "Error pinning chat");
    return false;
  }
}

// Function to remove pinned chat
export async function removePinnedChat(
  userId: string,
  chatId: string
): Promise<boolean> {
  try {
    await updateDoc(
      doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId),
      {
        timestamp: serverTimestamp(),
        pinned: false,
      }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, "Error removing pinned chat");
    return false;
  }
}

// Function to delete a chat
export async function deleteChat(
  userId: string,
  chatId: string
): Promise<boolean> {
  try {
    const chatDocRef = doc(
      db,
      COLLECTION_NAME,
      userId,
      collections.CHAT,
      chatId
    );
    await deleteDoc(chatDocRef);
    return true;
  } catch (error) {
    handleFirestoreError(error, "Error deleting chat");
    return false;
  }
}
