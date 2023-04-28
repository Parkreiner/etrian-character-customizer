import { PropsWithChildren, Component, ErrorInfo } from "react";

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

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render() {
    const { children, fallback } = this.props;
    const { errored } = this.state;

    return errored ? fallback : children;
  }
}
