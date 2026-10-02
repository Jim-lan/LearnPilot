import { notFound } from "next/navigation";

const content = {
  setup: ["Setup", "Your course, goal, and study preferences will live here."],
  today: ["Today", "A focused next step will appear here when the learning loop is ready."],
  evidence: ["Evidence", "Reviewed work and its source will be kept distinct from interpretations."],
  session: ["Session", "Practice and later checks will record each attempt and any support used."],
  progress: ["Progress", "Your progress will describe observed evidence and uncertainty."],
  data: ["Data settings", "Private storage, export, backup, and deletion controls will live here."],
} as const;

export const dynamic = "force-dynamic";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!(section in content)) notFound();
  const [title, description] = content[section as keyof typeof content];
  return <div className="page"><p className="eyebrow">Synthetic prototype</p><h1>{title}</h1><p className="lead">{description}</p><div className="notice">The app foundation is under construction. No real student data is needed yet.</div></div>;
}
