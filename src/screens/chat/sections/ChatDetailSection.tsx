import ChatDetailController from "../components/ChatDetailController";
import ChatResponseCard from "../components/ChatResponseCard";
import ChatInput from "../components/ChatInput";

type ChatDetailSectionProps = {
  title: string;
};

const ChatDetailSection = ({ title }: ChatDetailSectionProps) => {
  return (
    <div className="w-full h-full p-[16px] flex flex-col gap-[16px]">
      {/* Top section */}
      <div className="flex justify-between items-center">
        <h3 className="text-[20px] font-bold text-[#1E1F22]">{title}</h3>
        <ChatDetailController />
      </div>
      {/* Main chat detail section */}
      <div className="bg-[#F5F5F5] h-[calc(100%-48px)] w-[calc(100% + 32px)] rounded-lg ml-[-16px] flex justify-center px-[24px]">
        {/* Wrapper */}
        <div className="h-full w-full max-w-[736px] flex flex-col gap-[24px] justify-between items-center py-[24px] ">
          {/* Chat detail section */}
          <div className="h-full w-full overflow-y-auto flex flex-col gap-[24px] pr-[8px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <ChatResponseCard
              type="self"
              date="24 Sep - 11:30 PM"
              response="How do you define usability testing in UX design?"
            />

            {/* Open AI response */}
            <ChatResponseCard
              type="ai"
              aiModel="gpt"
              date="24 Sep - 11:30 PM"
              response="Sure! Here are three different versions of 404 error messages
                  for an ecommerce clothing website: Uh-oh! It looks like the
                  page you're looking for isn't here. Please check the URL and
                  try again or return to the homepage to continue shopping. 2.
                  Whoops! We can't seem to find the page you're looking for.
                  Please double-check the URL or use our search bar to find what
                  you need. You can also browse our collection of stylish
                  clothes and accessories. 3. Sorry, the page you're trying to
                  access isn't available. It's possible that the item has sold
                  out or the page has been removed. Please click back to return
                  to the previous page or head over to our homepage to explore
                  more."
            />

            {/* Gemini AI response */}
            <ChatResponseCard
              type="ai"
              aiModel="gemini"
              date="24 Sep - 11:30 PM"
              response="Sure! Here are three different versions of 404 error messages
                  for an ecommerce clothing website: Uh-oh! It looks like the
                  page you're looking for isn't here. Please check the URL and
                  try again or return to the homepage to continue shopping. 2.
                  Whoops! We can't seem to find the page you're looking for.
                  Please double-check the URL or use our search bar to find what
                  you need. You can also browse our collection of stylish
                  clothes and accessories. 3. Sorry, the page you're trying to
                  access isn't available. It's possible that the item has sold
                  out or the page has been removed. Please click back to return
                  to the previous page or head over to our homepage to explore
                  more."
            />

            {/* Mistral AI response */}
            <ChatResponseCard
              type="ai"
              aiModel="mistral"
              date="24 Sep - 11:30 PM"
              response="Sure! Here are three different versions of 404 error messages
                  for an ecommerce clothing website: Uh-oh! It looks like the
                  page you're looking for isn't here. Please check the URL and
                  try again or return to the homepage to continue shopping. 2.
                  Whoops! We can't seem to find the page you're looking for.
                  Please double-check the URL or use our search bar to find what
                  you need. You can also browse our collection of stylish
                  clothes and accessories. 3. Sorry, the page you're trying to
                  access isn't available. It's possible that the item has sold
                  out or the page has been removed. Please click back to return
                  to the previous page or head over to our homepage to explore
                  more."
            />

            {/* Claude AI response */}
            <ChatResponseCard
              type="ai"
              aiModel="claude"
              date="24 Sep - 11:30 PM"
              response="Sure! Here are three different versions of 404 error messages
                  for an ecommerce clothing website: Uh-oh! It looks like the
                  page you're looking for isn't here. Please check the URL and
                  try again or return to the homepage to continue shopping. 2.
                  Whoops! We can't seem to find the page you're looking for.
                  Please double-check the URL or use our search bar to find what
                  you need. You can also browse our collection of stylish
                  clothes and accessories. 3. Sorry, the page you're trying to
                  access isn't available. It's possible that the item has sold
                  out or the page has been removed. Please click back to return
                  to the previous page or head over to our homepage to explore
                  more."
            />

            {/* LLaMA 3.1 405B AI response */}
            <ChatResponseCard
              type="ai"
              aiModel="llama"
              date="24 Sep - 11:30 PM"
              response="Sure! Here are three different versions of 404 error messages
                  for an ecommerce clothing website: Uh-oh! It looks like the
                  page you're looking for isn't here. Please check the URL and
                  try again or return to the homepage to continue shopping. 2.
                  Whoops! We can't seem to find the page you're looking for.
                  Please double-check the URL or use our search bar to find what
                  you need. You can also browse our collection of stylish
                  clothes and accessories. 3. Sorry, the page you're trying to
                  access isn't available. It's possible that the item has sold
                  out or the page has been removed. Please click back to return
                  to the previous page or head over to our homepage to explore
                  more."
            />
          </div>
          {/* Chat input section */}
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default ChatDetailSection;
