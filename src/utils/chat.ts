import { ChatDetail } from "@/types/chat";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

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

export const sortChatByDateDesc = (list: ChatDetail[]) => {
  return list.sort((a, b) =>
    moment(b.timestamp.toDate()).diff(moment(a.timestamp.toDate()))
  );
};

export const groupChatByDate = (data: ChatDetail[]): ChatGroups => {
  const today = moment();
  const yesterday = moment().subtract(1, "days");
  const sevenDaysAgo = moment().subtract(7, "days");
  const thirtyDaysAgo = moment().subtract(30, "days");

  const groups: ChatGroups = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    previousMonths: {},
  };

  data.forEach((item) => {
    const date = item.timestamp.toDate(); // Assuming timestamp is a Firestore Timestamp
    const itemDate = moment(date);

    if (itemDate.isSame(today, "day")) {
      groups.today.push(item);
    } else if (itemDate.isSame(yesterday, "day")) {
      groups.yesterday.push(item);
    } else if (itemDate.isAfter(sevenDaysAgo)) {
      groups.previous7Days.push(item);
    } else if (itemDate.isAfter(thirtyDaysAgo)) {
      groups.previous30Days.push(item);
    } else {
      const monthName = itemDate.format("MMMM YYYY");
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
    const [item] = fromArray.splice(index, 1);
    item.timestamp = Timestamp.now();

    return {
      result: {
        newFromArray: [...fromArray],
        newToArray: [item, ...toArray],
      },
      notFound: false,
    };
  }

  return {
    result: { newFromArray: fromArray, newToArray: toArray },
    notFound: true,
  };
};

export const deleteChatById = (id: string, chats: ChatDetail[]) => {
  return chats.filter((item) => item.id !== id);
};
