import type { Metadata } from "next";
import Link from "next/link";
import { selectedLearner } from "@/server/learner";
import "./styles.css";

export const metadata: Metadata = {
  title: "LearnPilot",
  description: "A local, evidence-aware learning companion",
};

const sections = [
  ["/setup", "Choose learner"],
  ["/subjects", "Subjects"],
  ["/evidence", "Evidence"],
  ["/session", "Session"],
  ["/progress", "Progress"],
  ["/data", "Data"],
] as const;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const learner = await selectedLearner();
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <aside className="sidebar">
            <Link className="brand" href="/">Learn<span>Pilot</span></Link>
            <p className="sidebar-label">{learner ? `${learner.name} · Grade ${learner.grade}` : "Your learning space"}</p>
            <nav aria-label="Primary navigation">
              {sections.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
            </nav>
            <div className="sidebar-foot"><strong>Synthetic prototype</strong><p>Hosted on your laptop · AI off</p></div>
          </aside>
          <main id="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
