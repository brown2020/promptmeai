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
  deleteField,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { paths } from "@/firebase/paths";
import { truncateChatName } from "@/utils/chat";

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

  const chatName = truncateChatName(
    typeof messages[0]?.userMessage?.content === "string"
      ? messages[0].userMessage.content
      : ""
  );

  try {
    const chatRef = await addDoc(
      collection(db, COLLECTION_NAME, userId, collections.CHAT),
      {
        userId,
        fullName,
        timestamp: serverTimestamp(),
        name: chatName,
      }
    );
    await setDoc(doc(db, paths.userChatTranscript(userId, chatRef.id)), {
      userId,
      chat: chatData,
    });

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
    await setDoc(doc(db, paths.userChatTranscript(userId, chatId)), {
      userId,
      chat: chatData,
    });
    await updateDoc(doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId), {
      docId: chatId,
      timestamp: serverTimestamp(),
      chat: deleteField(),
    });
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
    const transcriptRef = doc(db, paths.userChatTranscript(userId, chatId));
    const transcriptSnap = await getDoc(transcriptRef);
    const chatRef = doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId);
    const docSnap = transcriptSnap.exists() ? transcriptSnap : await getDoc(chatRef);
    const rawChat = docSnap.data()?.chat;

    if (docSnap.exists() && typeof rawChat === "string") {
      if (!transcriptSnap.exists()) {
        await setDoc(transcriptRef, { userId, chat: rawChat });
        await updateDoc(chatRef, { chat: deleteField() });
      }
      try {
        const parsedMessages: Message[] = JSON.parse(rawChat);
        return { chat: parsedMessages };
      } catch (error) {
        handleFirestoreError(error, "Failed to parse chat data");
        return null;
      }
    } else if (docSnap.exists()) {
      return null;
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

    await Promise.all(
      querySnapshot.docs.map(async (chatDoc) => {
        const rawChat = chatDoc.data().chat;
        if (typeof rawChat !== "string" || rawChat.length === 0) return;
        await setDoc(doc(db, paths.userChatTranscript(userId, chatDoc.id)), {
          userId,
          chat: rawChat,
        });
        await updateDoc(chatDoc.ref, { chat: deleteField() });
      })
    );

    return querySnapshot.docs.map((chatDoc) => ({
      id: chatDoc.id,
      name: chatDoc.data().name || "Unnamed Chat",
      timestamp: chatDoc.data().timestamp,
      pinned: chatDoc.data().pinned,
    }));
  } catch (error) {
    handleFirestoreError(error, "Error getting chat details");
    return [];
  }
}

/**
 * Generic helper to update a chat document with specific fields.
 * Reduces code duplication across update operations.
 */
async function updateChatField(
  userId: string,
  chatId: string,
  fields: Record<string, unknown>,
  errorMessage: string
): Promise<boolean> {
  try {
    await updateDoc(
      doc(db, COLLECTION_NAME, userId, collections.CHAT, chatId),
      {
        timestamp: serverTimestamp(),
        ...fields,
      }
    );
    return true;
  } catch (error) {
    handleFirestoreError(error, errorMessage);
    return false;
  }
}

// Function to pin chat
export const pinChat = (userId: string, chatId: string): Promise<boolean> =>
  updateChatField(userId, chatId, { pinned: true }, "Error pinning chat");

// Function to remove pinned chat
export const removePinnedChat = (userId: string, chatId: string): Promise<boolean> =>
  updateChatField(userId, chatId, { pinned: false }, "Error removing pinned chat");

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
