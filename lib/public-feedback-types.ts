export type FeedbackCategory = "problem" | "idea" | "feedback" | "feature";

export type FeedbackIdeaItem = {
  number: number;
  title: string;
  summary: string | null;
  description: string;
  status: string;
  score: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  reporter: { name: string | null };
  publicSubmission?: { user: { name: string | null } } | null;
  type?: { name: string } | null;
  project: { name: string; slug: string };
  _count?: { verdicts?: number; attachments?: number };
};

export function getFeedbackCategory(idea: {
  title: string;
  type?: { name: string } | null;
}): { category: FeedbackCategory; label: string; badgeClass: string } {
  const typeName = idea.type?.name?.toLowerCase() ?? "";
  const title = idea.title.toLowerCase();

  if (
    typeName.includes("bug") ||
    typeName.includes("problem") ||
    /\b(bug|error|fail|fails|broken|crash|lost|cannot|cant)\b/.test(title)
  ) {
    return {
      category: "problem",
      label: "Problem / Bug",
      badgeClass: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    };
  }
  if (
    typeName.includes("feature") ||
    /\b(feature|markdown|preview|add|support|new)\b/.test(title)
  ) {
    return {
      category: "idea",
      label: "Feature Request",
      badgeClass: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
    };
  }
  if (
    typeName.includes("improvement") ||
    /\b(improve|improvement|studio|workflow|export|speed)\b/.test(title)
  ) {
    return {
      category: "idea",
      label: "Improvement / Idea",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    };
  }
  return {
    category: "idea",
    label: "Feedback",
    badgeClass: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  };
}

export function getFeedbackStatus(idea: {
  status: string;
  _count?: { verdicts?: number };
  score?: number;
}): { label: string; pillClass: string; dotClass: string } {
  if (idea.status === "converted") {
    return {
      label: "Planned",
      pillClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
      dotClass: "bg-emerald-400",
    };
  }
  if (idea.status === "rejected" || idea.status === "archived") {
    return {
      label: "Declined",
      pillClass: "border-zk-border bg-zk-chip text-zk-muted",
      dotClass: "bg-zk-muted",
    };
  }
  const verdicts = idea._count?.verdicts ?? 0;
  if (verdicts >= 2) {
    return {
      label: "Under review",
      pillClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
      dotClass: "bg-amber-400",
    };
  }
  if (verdicts >= 1) {
    return {
      label: "In review",
      pillClass: "border-blue-500/30 bg-blue-500/10 text-blue-400",
      dotClass: "bg-blue-400",
    };
  }
  return {
    label: "New",
    pillClass: "border-zk-border bg-zk-card text-zk-text2",
    dotClass: "bg-zk-muted",
  };
}

export function feedbackSubmitterName(idea: {
  reporter: { name: string | null };
  publicSubmission?: { user: { name: string | null } } | null;
}): string {
  const accountName = idea.publicSubmission?.user.name?.trim();
  if (accountName) return accountName;
  const name = idea.reporter.name?.trim();
  return name && !/ public reporter$/i.test(name) ? name : "Guest";
}
