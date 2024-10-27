import { Timestamp } from "firebase/firestore";

export type ChatDetail = {
  id: string;
  name: string;
  timestamp: Timestamp;
  pinned?: boolean;
};
