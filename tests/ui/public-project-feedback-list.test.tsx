// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PublicProjectFeedbackList } from "@/components/public-project-feedback-list";
import type { FeedbackIdeaItem } from "@/lib/public-feedback-types";

afterEach(cleanup);

const mockIdeas: FeedbackIdeaItem[] = [
  {
    number: 1,
    title: "When I tap Save on my phone, nothing happens and my changes are lost.",
    summary: "Save fails on phone.",
    description: "Has reproduction steps to reproduce.",
    status: "open",
    score: 12,
    createdAt: new Date(),
    updatedAt: new Date(),
    reporter: { name: "Web public reporter" },
    project: { name: "Web", slug: "web" },
    type: { name: "Bug" },
    _count: { verdicts: 2, attachments: 1 },
  },
  {
    number: 2,
    title: "Marketing Video Studio with a simulated draft-to-final export workflow",
    summary: "Allow team leads to review timeline markers before rendering the video bundle.",
    description: "Allow team leads to review timeline markers.",
    status: "open",
    score: 28,
    createdAt: new Date(),
    updatedAt: new Date(),
    reporter: { name: "Helen Agbro" },
    project: { name: "Web", slug: "web" },
    type: { name: "Improvement" },
    _count: { verdicts: 1, attachments: 0 },
  },
  {
    number: 3,
    title: "Stop Inbox alerts for past participation after a bid is resolved",
    summary: "Notifications continue pinging even though the bid closed 48 hours ago.",
    description: "Notifications continue pinging.",
    status: "open",
    score: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    reporter: { name: "henry uks" },
    project: { name: "Web", slug: "web" },
    type: null,
    _count: { verdicts: 0, attachments: 0 },
  },
  {
    number: 4,
    title: "Add Markdown preview support in description fields",
    summary: "Support split edit/preview tab so formatting tables is verified prior to submission.",
    description: "Support split edit/preview tab.",
    status: "converted",
    score: 41,
    createdAt: new Date(),
    updatedAt: new Date(),
    reporter: { name: "Daniel Olaleye" },
    project: { name: "Web", slug: "web" },
    type: { name: "Feature" },
    _count: { verdicts: 3, attachments: 0 },
  },
];

describe("PublicProjectFeedbackList", () => {
  it("renders community feedback header with item count and filter tabs", () => {
    render(
      <PublicProjectFeedbackList
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
        ideas={mockIdeas}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Community feedback & reported problems" }),
    ).toBeTruthy();
    expect(screen.getByText("4 items")).toBeTruthy();
    expect(screen.getByRole("button", { name: "All" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Problems" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ideas" })).toBeTruthy();
  });

  it("renders feedback cards with category badges, author attribution, and status pills", () => {
    render(
      <PublicProjectFeedbackList
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
        ideas={mockIdeas}
      />,
    );

    // Titles
    expect(screen.getByText(/When I tap Save on my phone/)).toBeTruthy();
    expect(screen.getByText(/Marketing Video Studio/)).toBeTruthy();
    expect(screen.getByText(/Stop Inbox alerts/)).toBeTruthy();
    expect(screen.getByText(/Add Markdown preview support/)).toBeTruthy();

    // Category badges
    expect(screen.getByText("Problem / Bug")).toBeTruthy();
    expect(screen.getByText("Improvement / Idea")).toBeTruthy();
    expect(screen.getByText("Feedback")).toBeTruthy();
    expect(screen.getByText("Feature Request")).toBeTruthy();

    // Status pills
    expect(screen.getByText("Under review")).toBeTruthy();
    expect(screen.getByText("In review")).toBeTruthy();
    expect(screen.getByText("New")).toBeTruthy();
    expect(screen.getByText("Planned")).toBeTruthy();

    // Authors
    expect(screen.getByText("Guest")).toBeTruthy();
    expect(screen.getByText("Helen Agbro")).toBeTruthy();
    expect(screen.getByText("henry uks")).toBeTruthy();
    expect(screen.getByText("Daniel Olaleye")).toBeTruthy();
  });

  it("filters feedback by Problems and Ideas", () => {
    render(
      <PublicProjectFeedbackList
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
        ideas={mockIdeas}
      />,
    );

    // Filter to Problems
    fireEvent.click(screen.getByRole("button", { name: "Problems" }));
    expect(screen.getByText(/When I tap Save on my phone/)).toBeTruthy();
    expect(screen.queryByText(/Marketing Video Studio/)).toBeNull();
    expect(screen.queryByText(/Stop Inbox alerts/)).toBeNull();

    // Filter to Ideas
    fireEvent.click(screen.getByRole("button", { name: "Ideas" }));
    expect(screen.queryByText(/When I tap Save on my phone/)).toBeNull();
    expect(screen.getByText(/Marketing Video Studio/)).toBeTruthy();
    expect(screen.getByText(/Stop Inbox alerts/)).toBeTruthy();
    expect(screen.getByText(/Add Markdown preview support/)).toBeTruthy();

    // Back to All
    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText(/When I tap Save on my phone/)).toBeTruthy();
  });

  it("allows upvoting an item", () => {
    render(
      <PublicProjectFeedbackList
        orgSlug="ziki"
        projectSlug="web"
        projectName="Web"
        ideas={mockIdeas}
      />,
    );

    const upvoteButton = screen.getByRole("button", { name: "Upvote idea #1" });
    expect(upvoteButton.textContent).toContain("12");

    fireEvent.click(upvoteButton);
    expect(upvoteButton.textContent).toContain("13");
    expect(upvoteButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(upvoteButton);
    expect(upvoteButton.textContent).toContain("12");
    expect(upvoteButton.getAttribute("aria-pressed")).toBe("false");
  });
});
