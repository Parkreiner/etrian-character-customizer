import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import Editor from "@/components/Editor";
import HeaderProvider, { useCurrentHeader } from "@/contexts/HeaderLevels";

function AppFallback() {
  const HeaderTag = useCurrentHeader();

  return (
    <section className="flex h-full w-full flex-col items-center justify-center">
      <div className="max-w-2xl rounded-xl bg-white p-12 shadow-lg">
        <HeaderTag className="mb-4 text-2xl font-bold">Error</HeaderTag>

        <p>
          The app has run into a breaking error. The error has been logged, and
          a fix will be in the works soon. Please try refreshing the page, but
          really sorry about the inconvenience.
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="h-full w-full bg-gradient-to-br from-teal-500 to-teal-50">
      <HeaderProvider>
        <ErrorBoundary fallback={<AppFallback />}>
          <TooltipProvider delayDuration={500}>
            <Editor />
          </TooltipProvider>
        </ErrorBoundary>
      </HeaderProvider>
    </div>
  );
}
