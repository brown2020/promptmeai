import { ModalWarning } from "@/components/modals";

type Props = {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
};

const ChatUsageWarning = ({ isOpen, title, onConfirm }: Props) => (
  <ModalWarning
    isOpen={isOpen}
    title={title}
    confirmText="Go to settings page"
    onConfirm={onConfirm}
  />
);

export default ChatUsageWarning;
