import { Timestamp } from "firebase/firestore";

export type ChatDetail = {
  id: string;
  name: string;
  timestamp: Timestamp;
  bookmarked?: boolean;
};
