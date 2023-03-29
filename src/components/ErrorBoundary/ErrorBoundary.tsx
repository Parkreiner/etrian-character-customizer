import { PropsWithChildren, Component, ErrorInfo } from "react";

export default class ErrorBoundary extends Component<PropsWithChildren> {
  state = { errored: false };

  static getDerivedStateFromError() {
    return { errored: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render() {
    const { children } = this.props;
    const { errored } = this.state;

    if (!errored) {
      return <>{children}</>;
    }

    return (
      <section className="flex h-full w-full flex-col items-center justify-center">
        <div className="max-w-2xl rounded-xl bg-white p-12 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold">Error</h2>
          <p>
            The app has run into a breaking error. The error has been logged,
            and a fix will be in the works soon. Please try refreshing the page,
            but really sorry about the inconvenience.
          </p>
        </div>
      </section>
    );
  }
}
