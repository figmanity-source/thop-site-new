export default function SectionTransition() {
  return <div className="pulz-transition" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div>;
}
