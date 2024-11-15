import { adminDb } from "@/firebase/firebaseAdmin";

export const fetchUsersByAuthEmail = async (email: string) => {
  try {
    const snapshot = await adminDb
      .collection("users")
      .where("authEmail", "==", email)
      .get();

    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    // Map over each document and get its data
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users by email:", error);
    throw error;
  }
};

export async function moveDocumentWithoutFields<
  T extends Record<string, unknown>
>(
  sourcePath: string,
  targetPath: string,
  fieldsToExclude: (keyof T)[]
): Promise<void> {
  try {
    const sourceDoc = await adminDb.doc(sourcePath).get();
    if (!sourceDoc.exists) {
      console.log("Source document does not exist.");
      return;
    }

    // Retrieve and type the document data
    const data = sourceDoc.data() as T;
    if (!data) {
      console.log("No data found in the source document.");
      return;
    }

    // Filter out the fields to exclude
    const filteredData = Object.keys(data)
      .filter((key) => !fieldsToExclude.includes(key as keyof T))
      .reduce((obj, key) => {
        obj[key as keyof T] = data[key as keyof T];
        return obj;
      }, {} as Partial<T>);

    // Merge filtered data into the target document
    await adminDb.doc(targetPath).set(filteredData, { merge: true });
    console.log(
      `Data merged into ${targetPath} without fields: ${fieldsToExclude.join(
        ", "
      )}`
    );

    // Optionally, delete the source document
    // await adminDb.doc(sourcePath).delete();
    // console.log(`Source document at ${sourcePath} deleted.`);
  } catch (error) {
    console.error("Error moving document without specific fields:", error);
  }
}

export async function moveCollection(
  sourceCollectionPath: string,
  targetCollectionPath: string
): Promise<void> {
  try {
    const sourceSnapshot = await adminDb.collection(sourceCollectionPath).get();

    if (sourceSnapshot.empty) {
      console.log("Source collection is empty.");
      return;
    }

    const batch = adminDb.batch();

    sourceSnapshot.forEach((doc) => {
      const data = doc.data();
      const targetDocRef = adminDb.collection(targetCollectionPath).doc(doc.id);

      batch.set(targetDocRef, data); // Add document data to the target collection
      // batch.delete(doc.ref); // Optionally delete the source document
    });

    await batch.commit();
    console.log(
      `Data moved from ${sourceCollectionPath} to ${targetCollectionPath}`
    );
  } catch (error) {
    console.error("Error moving collection:", error);
  }
}
