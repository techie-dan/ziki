"use client";

import { useState } from "react";
import Link from "next/link";
import { LocalTime } from "@/components/local-time";
import {
  feedbackSubmitterName,
  getFeedbackCategory,
  getFeedbackStatus,
  type FeedbackIdeaItem,
} from "@/lib/public-feedback-types";
import { publicFeedbackPath } from "@/lib/public-project-paths";

type FilterTab = "all" | "problems" | "ideas";

function avatarColor(name: string): string {
  const colors = [
    "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "bg-rose-500/20 text-rose-400 border-rose-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length]!;
}

export function PublicProjectFeedbackList({
  orgSlug,
  projectSlug,
  projectName,
  ideas,
}: {
  orgSlug: string;
  projectSlug: string;
  projectName: string;
  ideas: FeedbackIdeaItem[];
}) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [votes, setVotes] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    for (const idea of ideas) {
      map[idea.number] = Math.max(idea.score, 1);
    }
    return map;
  });
  const [votedMap, setVotedMap] = useState<Record<number, boolean>>({});

  function handleVote(num: number) {
    const alreadyVoted = Boolean(votedMap[num]);
    setVotedMap((prev) => ({ ...prev, [num]: !alreadyVoted }));
    setVotes((prev) => ({
      ...prev,
      [num]: (prev[num] ?? 1) + (alreadyVoted ? -1 : 1),
    }));
  }

  const categorized = ideas.map((idea) => {
    const cat = getFeedbackCategory(idea);
    const status = getFeedbackStatus(idea);
    const submitter = feedbackSubmitterName(idea);
    return { ...idea, categoryMeta: cat, statusMeta: status, submitter };
  });

  const filtered = categorized.filter((item) => {
    if (filter === "problems") return item.categoryMeta.category === "problem";
    if (filter === "ideas") return item.categoryMeta.category === "idea";
    return true;
  });

  return (
    <section aria-label="Community feedback & reported problems" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h2 className="text-lg font-bold text-zk-text sm:text-xl">
            Community feedback &amp; reported problems
          </h2>
          <span className="rounded-full bg-zk-card px-2.5 py-0.5 text-xs font-semibold text-zk-text2 border border-zk-border">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-zk-text2">
          <span>Filter:</span>
          <div className="inline-flex rounded-xl border border-zk-border bg-zk-surface p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-zk-card text-zk-text border border-zk-border shadow-sm"
                  : "text-zk-muted hover:text-zk-text"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("problems")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === "problems"
                  ? "bg-zk-card text-zk-text border border-zk-border shadow-sm"
                  : "text-zk-muted hover:text-zk-text"
              }`}
            >
              Problems
            </button>
            <button
              type="button"
              onClick={() => setFilter("ideas")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                filter === "ideas"
                  ? "bg-zk-card text-zk-text border border-zk-border shadow-sm"
                  : "text-zk-muted hover:text-zk-text"
              }`}
            >
              Ideas
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-zk-border bg-zk-surface p-8 text-center text-sm text-zk-muted">
          No feedback matching this filter yet for {projectName}.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((item) => {
            const attachmentCount = item._count?.attachments ?? 0;
            const hasAttachment = attachmentCount > 0;
            const hasSteps =
              item.categoryMeta.category === "problem" &&
              (item.description?.toLowerCase().includes("steps") ||
                item.description?.toLowerCase().includes("reproduce"));
            const userInitial = (item.submitter[0] ?? "U").toUpperCase();
            const isVoted = Boolean(votedMap[item.number]);
            const voteCount = votes[item.number] ?? Math.max(item.score, 1);

            return (
              <li
                key={item.number}
                className="flex items-start gap-4 rounded-2xl border border-zk-border bg-zk-surface p-4 transition hover:border-zk-border/80 sm:p-5"
              >
                <button
                  type="button"
                  onClick={() => handleVote(item.number)}
                  aria-label={`Upvote idea #${item.number}`}
                  aria-pressed={isVoted}
                  className={`flex min-w-12 flex-col items-center justify-center rounded-xl border px-2.5 py-2 transition ${
                    isVoted
                      ? "border-electric-blue-strong bg-electric-blue-strong/15 text-electric-blue-strong"
                      : "border-zk-border bg-zk-card text-zk-text2 hover:border-zk-muted hover:text-zk-text"
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m18 15-6-6-6 6" />
                  </svg>
                  <span className="text-xs font-bold tabular-nums">{voteCount}</span>
                </button>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`${publicFeedbackPath({ orgSlug, projectSlug })}?idea=${item.number}`}
                      className="text-base font-bold text-zk-text hover:text-zk-accent"
                    >
                      {item.title}
                    </Link>
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-semibold ${item.categoryMeta.badgeClass}`}
                    >
                      {item.categoryMeta.label}
                    </span>
                  </div>

                  {hasAttachment || hasSteps ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-zk-muted">
                      {hasAttachment ? (
                        <span className="inline-flex items-center gap-1">
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                          </svg>
                          {attachmentCount} attachment{attachmentCount > 1 ? "s" : ""}
                        </span>
                      ) : null}
                      {hasSteps ? (
                        <span className="inline-flex items-center gap-1">
                          <span aria-hidden="true">&gt;</span> Has reproduction steps
                        </span>
                      ) : null}
                    </div>
                  ) : item.summary || item.description ? (
                    <p className="line-clamp-2 text-xs leading-5 text-zk-text2">
                      {item.summary || item.description}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-2 pt-1 text-xs text-zk-muted">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${avatarColor(
                        item.submitter,
                      )}`}
                    >
                      {userInitial}
                    </span>
                    <span className="font-medium text-zk-text2">{item.submitter}</span>
                    <span>·</span>
                    <LocalTime date={item.createdAt} />
                  </div>
                </div>

                <div className="shrink-0 pt-0.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${item.statusMeta.pillClass}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${item.statusMeta.dotClass}`} />
                    {item.statusMeta.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
