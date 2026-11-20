import "server-only";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { optionalUser } from "@/lib/auth-helpers";
export { feedbackSubmitterName } from "@/lib/public-feedback-types";

const feedbackIdeaSelect = {
  number: true, title: true, summary: true, description: true,
  status: true, score: true, createdAt: true, updatedAt: true,
  reporter: { select: { name: true } },
  publicSubmission: { select: { user: { select: { name: true } } } },
  type: { select: { name: true } },
  project: { select: { name: true, slug: true } },
  _count: { select: { verdicts: true, attachments: true } },
} satisfies Prisma.IdeaSelect;

export type FeedbackIdea = Prisma.IdeaGetPayload<{ select: typeof feedbackIdeaSelect }>;

/** Only customer-submitted feedback on public projects is listed externally.
 * Private reports remain reachable through their private tracking links.
 * Agent verdicts are read here; this portal never casts them on a visitor's behalf.
 */
export async function listPublicFeedbackIdeas(orgSlug: string, options: {
  projectSlug?: string; projectSlugs?: string[]; query?: string; number?: number; source?: "public" | Prisma.StringFilter | Prisma.NestedStringFilter;
} = {}): Promise<FeedbackIdea[]> {
  const user = await optionalUser();
  const visibleProject: Prisma.ProjectWhereInput = {
    archivedAt: null,
    ...(options.projectSlug ? { slug: options.projectSlug } : options.projectSlugs ? { slug: { in: options.projectSlugs } } : {}),
    ...(user?.role === "super_admin" ? {} : { OR: [
      { visibility: "public" },
      ...(user ? [
        { memberships: { some: { userId: user.id } } },
        { organisation: { memberships: { some: { userId: user.id } } } },
      ] : []),
    ] }),
  };
  return prisma.idea.findMany({
    where: {
      source: options.source ?? "public",
      isDeleted: false,
      track: "product",
      securityFinding: { is: null },
      organisation: { slug: orgSlug, archivedAt: null },
      project: visibleProject,
      ...(options.number !== undefined ? { number: options.number } : {}),
      ...(options.query ? { OR: [
        { title: { contains: options.query, mode: "insensitive" } },
        { summary: { contains: options.query, mode: "insensitive" } },
      ] } : {}),
    },
    select: feedbackIdeaSelect,
    orderBy: [{ createdAt: "desc" }, { number: "desc" }],
    take: 50,
  });
}
