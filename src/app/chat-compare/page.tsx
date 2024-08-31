import ChatCompare from "@/components/ChatCompare";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        <ChatCompare />
      </div>
    </div>
  );
}
