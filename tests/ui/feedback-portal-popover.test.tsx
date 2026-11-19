// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FeedbackPortalPopover } from "@/components/feedback-portal-popover";

afterEach(cleanup);

describe("FeedbackPortalPopover", () => {
  it("renders a subtle Feedback button without heavy border box", () => {
    render(
      <FeedbackPortalPopover
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
      />,
    );

    const button = screen.getByRole("button", { name: "Feedback" });
    expect(button).toBeTruthy();
    expect(button.textContent).toContain("Feedback");
    expect(button.textContent).not.toContain("Feedback portal");
    // Subtle styling: text-zk-muted, no border class
    expect(button.className).toContain("text-zk-muted");
    expect(button.className).not.toContain("border-zk-border");
  });

  it("opens the feedback portal dialog and does not render the organization portal link", () => {
    render(
      <FeedbackPortalPopover
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
      />,
    );

    const button = screen.getByRole("button", { name: "Feedback" });
    fireEvent.click(button);

    // Dialog is open
    expect(screen.getByRole("dialog", { name: "Project feedback portal" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Copy link" })).toBeTruthy();
    expect(screen.getByRole("link", { name: /^Open portal/ })).toBeTruthy();

    // Organization feedback portal link must be removed
    expect(screen.queryByRole("link", { name: "Organization feedback portal" })).toBeNull();
  });
});
