"use client";

import { PortalSearch } from "@/components/portal-search";
import { useState } from "react";
import Link from "next/link";
import { publicFeedbackPath } from "@/lib/public-project-paths";

export type OrgFeedbackProjectCardItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  platforms?: string[];
};

export function OrgFeedbackPortal({
  orgSlug,
  orgName,
  projects,
  initialQuery = "",
  returnHref,
}: {
  orgSlug: string;
  orgName: string;
  projects: OrgFeedbackProjectCardItem[];
  initialQuery?: string;
  returnHref?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const needle = query.trim().toLowerCase();
  const filtered = projects.filter(project =>
    !needle || [project.name, project.description, project.slug].some(value => value.toLowerCase().includes(needle))
  );

  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-[920px] flex-col justify-between pb-8 pt-2">
      <div className="space-y-6">
        <div className="space-y-2">
          <Link
            href={returnHref ?? `/${encodeURIComponent(orgSlug)}`}
            className="inline-flex min-h-8 items-center gap-1.5 text-sm font-semibold text-electric-blue-strong hover:underline"
          >
            <span aria-hidden="true">←</span> {returnHref === "/discover" ? "Back to Discover" : "Back to projects"}
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-zk-text sm:text-4xl">
            {orgName} project portal
          </h1>
          <p className="text-base text-zk-text2">
            Choose a project to browse its feedback, report a problem, or suggest an improvement.
          </p>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-2">
          <Link href={`/${encodeURIComponent(orgSlug)}/feedback?view=ideas`} className="inline-flex min-h-10 items-center rounded-xl border border-zk-border bg-zk-surface px-4 py-2 text-sm font-semibold text-zk-accent hover:bg-zk-chip">View all feedback ideas →</Link>
          <PortalSearch label="Search projects" value={query} onValueChange={setQuery} />
        </div>


        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-zk-border bg-zk-surface p-10 text-center">
            <h2 className="text-base font-semibold text-zk-text">No projects found</h2>
            <p className="mt-1 text-sm text-zk-text2">
              {needle
                ? "Try searching with a different project name."
                : "No projects are available for feedback right now."}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zk-border bg-zk-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <caption className="sr-only">Products available in the {orgName} project portal</caption>
                <thead className="border-b border-zk-border bg-zk-card text-xs font-semibold text-zk-text2">
                  <tr><th scope="col" className="px-5 py-3.5">Product</th><th scope="col" className="hidden px-5 py-3.5 sm:table-cell">About</th><th scope="col" className="px-5 py-3.5 text-right">Explore</th></tr>
                </thead>
                <tbody className="divide-y divide-zk-divider">
                  {filtered.map(project => (
                    <tr key={project.id} className="transition hover:bg-zk-chip/40">
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div>
                            <Link href={publicFeedbackPath({ orgSlug, projectSlug: project.slug })} className="text-base font-bold text-zk-text hover:text-zk-accent">{project.name}</Link>
                            <p className="mt-1 line-clamp-2 max-w-48 text-xs text-zk-muted sm:hidden">{project.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden max-w-sm px-5 py-5 text-sm leading-6 text-zk-text2 sm:table-cell"><p className="line-clamp-2">{project.description}</p></td>
                      <td className="whitespace-nowrap px-5 py-5 text-right">
                        <Link href={publicFeedbackPath({ orgSlug, projectSlug: project.slug })} aria-label={`View details for ${project.name}`} className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl border border-zk-border bg-zk-surface px-3 py-2 text-xs font-semibold text-zk-accent transition hover:border-zk-accent hover:bg-zk-tint">View details <span aria-hidden="true">→</span></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-16 border-t border-zk-divider pt-6 text-center text-xs text-zk-muted">
        Powered by <span className="font-bold text-zk-text">Ziki</span>
      </footer>
    </div>
  );
}
