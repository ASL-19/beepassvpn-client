import { Component, ReactNode } from "react";

import { cordovaReport } from "../utils/reporter";

type Props = {
  children: ReactNode;
};

type State = {
  error: string;
  hasError: boolean;
};
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = { error: "", hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.setState({ error: error.message });
    cordovaReport({
      feedbackCategory: "Unexpected Error",
      userFeedback: error.message,
    });
  }

  render() {
    if (this.state.hasError) {
      // TODO: Add fallback screen
      return <h1>Something Went Wrong {this.state.error}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
