"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="page"><h1>Something interrupted this page.</h1><p className="lead">Your saved work stays on this computer. Try loading this page again.</p><button className="button" onClick={reset}>Try again</button></div>;
}
