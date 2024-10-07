import Markdown from "markdown-to-jsx";

export function RenderMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      options={{
        overrides: {
          h1: { props: { className: "text-3xl font-bold mb-4 text-gray-100" } },
          h2: { props: { className: "text-2xl font-semibold mb-3 mt-6 text-gray-200" } },
          h3: { props: { className: "text-xl font-semibold mb-2 mt-4 text-gray-200" } },
          h4: { props: { className: "text-lg font-semibold mb-2 mt-4 text-gray-200" } },
          p: { props: { className: "mb-4 text-gray-300" } },
          a: { props: { className: "hover:underline text-blue-500" } },
          ul: { props: { className: "list-disc pl-5 mb-4 text-gray-300" } },
          ol: { props: { className: "list-decimal pl-5 mb-4 text-gray-300" } },
          li: { props: { className: "mb-1" } },
          code: { props: { className: "bg-gray-800 rounded px-1 py-0.5 text-sm font-mono text-gray-200" } },
          pre: { props: { className: "bg-gray-800 rounded p-4 mb-4 overflow-x-auto" } },
        },
      }}
    >
      {children}
    </Markdown>
  );
}
