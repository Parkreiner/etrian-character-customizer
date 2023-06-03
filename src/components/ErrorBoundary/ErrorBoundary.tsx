import { PropsWithChildren, Component, ErrorInfo } from "react";
import { handleError } from "@/utils/errors";

type Props = PropsWithChildren<{
  fallback: JSX.Element;
}>;

type State = {
  errored: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  state = { errored: false };

  static getDerivedStateFromError(): Partial<State> {
    return { errored: true };
  }

  componentDidCatch(runtimeError: Error, componentErrorInfo: ErrorInfo): void {
    handleError(runtimeError, componentErrorInfo);
  }

  render() {
    const { children, fallback } = this.props;
    const { errored } = this.state;

    return errored ? fallback : children;
  }
}
