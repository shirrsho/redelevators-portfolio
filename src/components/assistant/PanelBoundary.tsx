"use client";

import { Component, type ReactNode } from "react";
import { forgetChat } from "./store";

/**
 * If the chat panel ever crashes (a malformed card, or a chat saved by an older version), it forgets this tab's
 * chat and hides itself instead of breaking the page it sits on. Without this, the saved chat would crash every
 * page in the tab on reload.
 */
export class PanelBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  /** One fresh start per page: if the panel still crashes on an empty chat, it stays hidden until a reload. */
  private retried = false;

  componentDidCatch(err: unknown) {
    console.error("assistant panel crashed; chat cleared", err);
    forgetChat();
    if (!this.retried) {
      this.retried = true;
      this.setState({ failed: false });
    }
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
