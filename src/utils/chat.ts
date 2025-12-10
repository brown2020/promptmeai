import { ChatDetail } from "@/types/chat";
import { Timestamp } from "firebase/firestore";
import {
  isToday,
  isYesterday,
  subDays,
  isAfter,
  format,
  compareDesc,
} from "date-fns";

export type ChatGroups = {
  today: ChatDetail[];
  yesterday: ChatDetail[];
  previous7Days: ChatDetail[];
  previous30Days: ChatDetail[];
  previousMonths: Record<string, ChatDetail[]>;
};

export const searchChatByName = (
  data: ChatDetail[],
  searchTerm: string
): ChatDetail[] => {
  return data.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const sortChatByDateDesc = (list: ChatDetail[]): ChatDetail[] => {
  return [...list].sort((a, b) =>
    compareDesc(a.timestamp.toDate(), b.timestamp.toDate())
  );
};

export const groupChatByDate = (data: ChatDetail[]): ChatGroups => {
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  const thirtyDaysAgo = subDays(now, 30);

  const groups: ChatGroups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    previousMonths: {},
  };

  data.forEach((item) => {
    const date = item.timestamp.toDate();

    if (isToday(date)) {
      groups.today.push(item);
    } else if (isYesterday(date)) {
      groups.yesterday.push(item);
    } else if (isAfter(date, sevenDaysAgo)) {
      groups.previous7Days.push(item);
    } else if (isAfter(date, thirtyDaysAgo)) {
      groups.previous30Days.push(item);
    } else {
      const monthName = format(date, "MMMM yyyy");
      if (!groups.previousMonths[monthName]) {
        groups.previousMonths[monthName] = [];
      }
      groups.previousMonths[monthName].push(item);
    }
  });

  return groups;
};

export const moveChatById = (
  id: string,
  fromArray: ChatDetail[],
  toArray: ChatDetail[]
): {
  result: {
    newFromArray: ChatDetail[];
    newToArray: ChatDetail[];
  };
  notFound: boolean;
} => {
  const index = fromArray.findIndex((item) => item.id === id);

  if (index !== -1) {
    const newFromArray = [...fromArray];
    const [item] = newFromArray.splice(index, 1);
    const updatedItem = { ...item, timestamp: Timestamp.now() };

    return {
      result: {
        newFromArray,
        newToArray: [updatedItem, ...toArray],
      },
      notFound: false,
    };
  }

  return {
    result: { newFromArray: fromArray, newToArray: toArray },
    notFound: true,
  };
};

export const deleteChatById = (
  id: string,
  chats: ChatDetail[]
): ChatDetail[] => {
  return chats.filter((item) => item.id !== id);
};
