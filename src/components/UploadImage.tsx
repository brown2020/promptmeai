import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/firebaseClient";

const UploadImage: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [imageURL, setImageURL] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!imageFile) return;

    const storageRef = ref(storage, `images/${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => {
        console.error("Upload failed:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageURL(downloadURL);
        setProgress(0); // Reset progress bar
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 w-full border rounded p-2"
      />
      {imageFile && (
        <div className="w-full mb-4">
          <p className="text-sm mb-2">Uploading: {imageFile.name}</p>
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
              className="bg-blue-500 h-2 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={!imageFile}
      >
        Upload
      </button>
      {imageURL && (
        <div className="mt-4">
          <p className="text-sm mb-2">Uploaded Image:</p>
          <img src={imageURL} alt="Uploaded" className="max-w-full rounded" />
          <a
            href={imageURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm mt-2 block underline"
          >
            View Full Image
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
