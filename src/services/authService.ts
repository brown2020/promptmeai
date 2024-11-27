import { admin, adminDb } from "@/firebase/firebaseAdmin";

export const getUserById = async (userId: string) => {
  try {
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.log("No user found with the given ID.");
      return null;
    }

    // Access the user data
    const userData = userDoc.data();
    return userData;
  } catch (error) {
    console.error("Error getting user document: ", error);
    throw error;
  }
};

export const updateUserName = async (userId: string, name: string) => {
  try {
    // Update the user's display name in Firebase Authentication
    await admin.auth().updateUser(userId, { displayName: name });

    // Update the user's document in the Firestore `users` collection
    const userDocRef = adminDb.collection("users").doc(userId);
    await userDocRef.update({ name: name });
  } catch (error) {
    console.error("Error update user name: ", error);
    throw error;
  }
};
