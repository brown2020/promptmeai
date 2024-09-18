import { cn } from "@/utils/tailwind";
import { ComponentProps } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
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
      <a target="_blank" href={props.href}>
        {props.children}
      </a>
    ),
  };

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      className={cn("prose prose-sm", className)}
      components={components}
    >
      {content}
    </Markdown>
  );
};

export default MarkdownRenderer;
