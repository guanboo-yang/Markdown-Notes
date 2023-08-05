import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // `rehype-katex` does not import the CSS for you
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import CodeHighlight from "./code-highlight";
import { remarkDirectivePlugin } from "@/lib/utils";
// import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeSlug from "rehype-slug";

const Markdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      className="markdown p-4"
      remarkPlugins={[
        remarkMath,
        remarkGfm,
        remarkFrontmatter,
        remarkDirective,
        remarkDirectivePlugin,
      ]}
      rehypePlugins={[
        rehypeRaw,
        rehypeKatex,
        rehypeSlug,
        // rehypeToc
      ]}
      sourcePos
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeHighlight
              code={String(children).replace(/\n$/, "")}
              language={match[1]}
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
// export default memo(Markdown);
