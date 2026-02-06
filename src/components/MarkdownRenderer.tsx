import { cn } from "@/utils/tailwind";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const components = {
    p: (props: ComponentProps<"p">) => (
      <p style={{ whiteSpace: "pre-wrap" }}>{props.children}</p>
    ),
    a: (props: ComponentProps<"a">) => (
      <a target="_blank" rel="noopener noreferrer" href={props.href}>
        {props.children}
      </a>
    ),
  };

  return (
    <div className={cn("prose prose-sm dark:prose-invert", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
};

export default MarkdownRenderer;
