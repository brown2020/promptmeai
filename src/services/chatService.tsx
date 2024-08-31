import { db } from "@/firebase/firebaseClient";
import { CoreMessage } from "ai";
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
const COLLECTION_NAME = "promptme_chats";

export type Message = {
  userMessage: CoreMessage;
  responses: Record<string, CoreMessage>;
};

export async function saveChat(user: any, messages: Message[]) {
  try {
    const chatName = messages[0]?.userMessage?.content || 'Default Chat Name';
    const chatRef = await addDoc(collection(db, COLLECTION_NAME, user.id, "chat"), {
      userId: user.id,
      fullName: user.fullName,
      timestamp: serverTimestamp(),
      chat: JSON.stringify(messages),
      name: chatName
    });
    return chatRef.id ?? "";
  } catch (error) {
    console.log(error);
  }
}

export async function updateChat(user: any, chatId: string, messages: Message[]) {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, user.id, "chat", chatId), {
      docId: chatId,
      timestamp: serverTimestamp(),
      chat: JSON.stringify(messages),
    });

  } catch (error) {
    console.log(error);
  }
}

export async function getChat(userId: string, chatId: string) {
  try {
    const chatRef = doc(db, COLLECTION_NAME, userId, 'chat', chatId);

    const docSnap = await getDoc(chatRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.warn(`No chat found with ID: ${chatId}`);
      return null;
    }
  } catch (error) {
    console.error('Error getting chat:', error);
    return null;
  }
}

export async function getAllChatDetails(userId: string) {
  try {
    const chatsRef = collection(db, COLLECTION_NAME, userId, 'chat');

    const querySnapshot = await getDocs(chatsRef);

    const chatDetails = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Chat'
    }));

    return chatDetails;
  } catch (error) {
    console.error('Error getting chat details:', error);
    return [];
  }
}

export async function updateChatName(user: any, chatId: string, name: string) {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, user.id, "chat", chatId), {
      docId: chatId,
      timestamp: serverTimestamp(),
      name: name,
    });
    return true;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteChat(user: any, chatId: string): Promise<boolean> {
  try {
    const chatDocRef = doc(db, COLLECTION_NAME, user.id, "chat", chatId);
    await deleteDoc(chatDocRef);
    return true;
  } catch (error) {
    console.error("Error deleting chat: ", error);
    return false;
  }
}
