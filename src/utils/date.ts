import { ChatDetail } from "@/types/chat";
import moment from "moment";

type ChatGroups = {
  today: ChatDetail[];
  yesterday: ChatDetail[];
  previous7Days: ChatDetail[];
  previous30Days: ChatDetail[];
  previousMonths: Record<string, ChatDetail[]>;
};

export const sortByDateDesc = (list: ChatDetail[]) => {
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
