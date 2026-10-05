import { SpeakButton } from "./speak-button";

export function SpeakFrench({ label, value }: { label: string; value: string }) {
  return <span className="speak-control"><SpeakButton text={value} label={label} lang="fr-CA" rate={0.82} /><span className="muted"> {value}</span></span>;
}
