import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { BsThreeDots } from "react-icons/bs";

const ChatDetailController = () => {
  const saveHandler = () => {
    alert("save");
  };

  const deleteHandler = () => {
    alert("delete");
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly variant="light" className="bg-[#F9F9F9] shadow-xl">
          <BsThreeDots />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Chat Action"
        onAction={(key) => {
          switch (key) {
            case "save":
              return saveHandler();
            case "delete":
              return deleteHandler();
          }
        }}
      >
        <DropdownItem key="save">Save Chat</DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
          Delete Chat
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ChatDetailController;
