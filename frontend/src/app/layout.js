import "./globals.css";
import { QueryProvider } from "@/context/QueryContext";
import { RelatedQAProvider } from "@/context/RelatedQAContext";

export const metadata = {
  title: "AgentORC",
  description: "It is an Agent Orchestrator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <RelatedQAProvider>{children}</RelatedQAProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
