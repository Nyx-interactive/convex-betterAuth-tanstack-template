import { createFileRoute, Link } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/User-button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const formatDateTime = (value: unknown) => {
  if (!value) {
    return undefined;
  }

  const date =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toLocaleString();
};

function HomePage() {
  const { data: sessionData, isPending, error } = authClient.useSession();

  const session = sessionData?.session ?? null;
  const user = sessionData?.user ?? null;
  const displayName =
    (user?.name && user.name.trim()) ||
    (user?.email && user.email.trim()) ||
    session?.id ||
    undefined;
  const emailVerified =
    typeof user?.emailVerified === "boolean" ? user.emailVerified : undefined;

  const sessionCreatedAt = formatDateTime(session?.createdAt) ?? "—";
  const sessionExpiresAt = formatDateTime(session?.expiresAt) ?? "—";

  const statusMessage = isPending
    ? "Checking for an active session..."
    : session
      ? "You're currently signed in."
      : "You're not signed in yet.";

  const errorMessage = error?.message;

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Scaffold Ready
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Collectr
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">
              TanStack Start + Convex + Better Auth starter for a tweet
              collection app with installed-PWA share target support.
            </p>
          </div>
          <UserButton />
        </div>

        <section className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold">What&apos;s scaffolded</h2>
            <ul className="mt-4 grid gap-3 text-sm text-zinc-300">
              <li>Better Auth wired to Convex for email/password auth</li>
              <li>TanStack Start routing with authenticated SSR token hydration</li>
              <li>PWA manifest + service worker registration foundation</li>
              <li>
                Web Share Target route at <code>/share-target</code> for installed
                PWA handoff
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              {!session ? (
                <Button asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              ) : (
                <Button onClick={() => authClient.signOut()}>Sign out</Button>
              )}
              <Button asChild variant="outline">
                <Link
                  to="/share-target"
                  search={{
                    url: "https://x.com/jack/status/20",
                    text: "Saved from scaffold preview",
                  }}
                >
                  Preview share target
                </Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold">Next implementation</h2>
            <p className="mt-3 text-sm text-zinc-300">
              The detailed build plan lives in <code>docs/implementation-plan.md</code>.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Next pass is folders, nested folders, tweet storage, official tweet
              embeds, and save-from-share flow.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Authentication status
              </h2>
              <p className="text-sm text-zinc-300">{statusMessage}</p>
            </div>
            {session ? (
              <span className="inline-flex items-center self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/40">
                Logged in
              </span>
            ) : null}
          </div>

          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
            {isPending ? (
              <p className="text-sm text-zinc-300">
                Loading session information&hellip;
              </p>
            ) : session ? (
              <div className="space-y-4 text-sm">
                <p className="text-emerald-300">
                  Signed in as{" "}
                  <span className="font-semibold text-white">
                    {displayName ?? "Authenticated user"}
                  </span>
                </p>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      User ID
                    </dt>
                    <dd className="mt-1 wrap-break-word text-white">
                      {user?.id ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      Email
                    </dt>
                    <dd className="mt-1 wrap-break-word text-white">
                      {user?.email ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      Session ID
                    </dt>
                    <dd className="mt-1 wrap-break-word text-white">
                      {session?.id ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      Email verified
                    </dt>
                    <dd className="mt-1 text-white">
                      {emailVerified === undefined
                        ? "—"
                        : emailVerified
                          ? "Yes"
                          : "No"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      Signed in
                    </dt>
                    <dd className="mt-1 text-white">{sessionCreatedAt}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-zinc-400">
                      Expires
                    </dt>
                    <dd className="mt-1 text-white">{sessionExpiresAt}</dd>
                  </div>
                </dl>
              </div>
            ) : (
              <p className="text-sm text-zinc-300">
                No active session was found. Use the login link below to sign
                in.
              </p>
            )}

            {errorMessage ? (
              <p className="mt-3 text-xs text-red-300">
                Unable to load session details: {errorMessage}
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
