import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Editor from "../Editor/Editor";

export default function App() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-teal-100 to-teal-50">
      <ErrorBoundary>
        <TooltipProvider delayDuration={500}>
          <Editor />
        </TooltipProvider>
      </ErrorBoundary>
    </div>
  );
}
