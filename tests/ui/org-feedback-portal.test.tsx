// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { OrgFeedbackPortal } from "@/components/org-feedback-portal";

afterEach(cleanup);

describe("project portal filters", () => {
  it("opens Ziki-style compact search and filters products as you type", () => {
    render(
      <OrgFeedbackPortal
        orgSlug="team"
        orgName="Team"
        projects={[
          { id: "atlas", slug: "atlas", name: "Atlas", description: "Plan team projects", platforms: ["web"] },
          { id: "pocket", slug: "pocket", name: "Pocket", description: "Track expenses", platforms: ["mobile"] },
        ]}
      />,
    );
    expect(screen.queryByRole("searchbox", { name: "Search projects" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Search projects" }));
    fireEvent.change(screen.getByRole("searchbox", { name: "Search projects" }), { target: { value: "Atlas" } });
    expect(screen.getByRole("link", { name: "View details for Atlas" })).toBeTruthy();
    expect(screen.queryByRole("link", { name: "View details for Pocket" })).toBeNull();
    fireEvent.keyDown(screen.getByRole("searchbox", { name: "Search projects" }), { key: "Escape" });
    expect(screen.getByRole("button", { name: "Search projects" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("simplifies table layout without platform filter tabs or project count footer", () => {
    render(
      <OrgFeedbackPortal
        orgSlug="team"
        orgName="Team"
        projects={[
          { id: "atlas", slug: "atlas", name: "Atlas", description: "Atlas product summary", platforms: ["web"] },
          { id: "harbor", slug: "harbor", name: "Harbor", description: "Harbor product summary", platforms: ["web"] },
          { id: "pocket", slug: "pocket", name: "Pocket", description: "Pocket product summary", platforms: ["mobile"] },
        ]}
      />,
    );

    // Platform filter buttons must not be present
    expect(screen.queryByRole("button", { name: "All projects" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Web" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Mobile" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Desktop" })).toBeNull();

    // Table count footer must not be present
    expect(screen.queryByText(/Showing .* projects/)).toBeNull();

    // All products are rendered in table
    expect(screen.getAllByRole("link", { name: /^View details for / })).toHaveLength(3);
    expect(screen.getByRole("link", { name: "View details for Atlas" }).getAttribute("href")).toBe("/team/atlas/feedback");
    expect(screen.getByRole("link", { name: "View all feedback ideas →" }).getAttribute("href")).toBe("/team/feedback?view=ideas");
  });
});
