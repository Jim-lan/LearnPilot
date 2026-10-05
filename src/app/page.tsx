import { redirect } from "next/navigation";
import { selectedLearner } from "@/server/learner";

export default async function Home() {
  redirect((await selectedLearner()) ? "/subjects" : "/setup");
}
