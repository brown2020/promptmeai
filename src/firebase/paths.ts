/**
 * Centralized Firestore collection and document path builders.
 * Provides type-safe, consistent path construction across the application.
 */
export const paths = {
  // User paths
  user: (uid: string) => `users/${uid}`,
  userProfile: (uid: string) => `users/${uid}/profile/userData`,
  userPayments: (uid: string) => `users/${uid}/payments`,

  // Chat paths
  userChats: (uid: string) => `promptme_chats/${uid}/chat`,
  userChat: (uid: string, chatId: string) =>
    `promptme_chats/${uid}/chat/${chatId}`,
} as const;

// Collection names for use with collection() function
export const collections = {
  USERS: "users",
  PROMPTME_CHATS: "promptme_chats",
  CHAT: "chat",
  PROFILE: "profile",
  PAYMENTS: "payments",
} as const;
