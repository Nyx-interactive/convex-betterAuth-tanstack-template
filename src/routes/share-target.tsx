import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Link } from "@tanstack/react-router";

type ShareSearch = {
  text?: string;
  title?: string;
  url?: string;
};

const tweetUrlPattern = /(https?:\/\/(?:www\.|mobile\.)?(?:twitter\.com|x\.com)\/[\w_]+\/status\/\d+)/i;

const normalizeSearchValue = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const extractTweetUrl = ({ text, title, url }: ShareSearch) => {
  const directUrl = normalizeSearchValue(url);
  if (directUrl && tweetUrlPattern.test(directUrl)) {
    return directUrl.match(tweetUrlPattern)?.[1] ?? directUrl;
  }

  const combined = [normalizeSearchValue(text), normalizeSearchValue(title)]
    .filter(Boolean)
    .join(" ");

  return combined.match(tweetUrlPattern)?.[1];
};

export const Route = createFileRoute("/share-target")({
  validateSearch: (search): ShareSearch => ({
    title: normalizeSearchValue(search.title),
    text: normalizeSearchValue(search.text),
    url: normalizeSearchValue(search.url),
  }),
  component: ShareTargetPage,
});

function ShareTargetPage() {
  const search = Route.useSearch();
  const tweetUrl = extractTweetUrl(search);
  const { data: sessionData, isPending } = authClient.useSession();
  const session = sessionData?.session ?? null;
  const redirectParams = new URLSearchParams();

  if (search.title) {
    redirectParams.set("title", search.title);
  }

  if (search.text) {
    redirectParams.set("text", search.text);
  }

  if (search.url) {
    redirectParams.set("url", search.url);
  }

  const redirectTarget = redirectParams.size
    ? `/share-target?${redirectParams.toString()}`
    : "/share-target";

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
            PWA Share Target
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Shared content intake
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            This route is the landing point for installed-PWA share intents.
            Final save-to-folder behavior will be implemented next.
          </p>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <h2 className="text-lg font-semibold">Detected tweet URL</h2>
          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-zinc-300">
            {tweetUrl ? (
              <code className="break-all text-white">{tweetUrl}</code>
            ) : (
              <p>
                No valid tweet URL was detected yet. Chromium share sheets often
                pass links through either <code>url</code> or <code>text</code>, so
                the final ingest flow will check both.
              </p>
            )}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold">Auth status</h2>
            <p className="mt-3 text-sm text-zinc-300">
              {isPending
                ? "Checking session..."
                : session
                  ? "Authenticated session detected."
                  : "Not signed in yet."}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {session ? (
                <Button asChild>
                  <Link to="/">Return home</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/login" search={{ redirect: redirectTarget }}>
                    Sign in to continue
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold">Raw shared payload</h2>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-4 text-xs text-zinc-300">
{JSON.stringify(search, null, 2)}
            </pre>
          </div>
        </section>
      </div>
    </main>
  );
}
