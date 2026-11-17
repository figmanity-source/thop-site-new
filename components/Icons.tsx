/** Small decorative marks (replacing the watch-dial icons of the original). */
export function Mark({ dark = false, className = "fps-dial" }: { dark?: boolean; className?: string }) {
  const c = dark ? "#fff" : "#000";
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden>
      <circle cx="32" cy="32" r="31" stroke={c} strokeOpacity=".35" />
      <circle cx="32" cy="32" r="21" stroke={c} strokeOpacity=".6" />
      <ellipse cx="32" cy="32" rx="30" ry="9" stroke={c} strokeOpacity=".5" transform="rotate(-30 32 32)" />
      <circle cx="32" cy="32" r="7" fill={c} />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden>
      <path d="M8 56 56 8M20 8h36v36" stroke="currentColor" strokeWidth="5" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden>
      <path d="M5 0v10M0 5h10" stroke="currentColor" />
    </svg>
  );
}

export function Cross() {
  return (
    <svg viewBox="0 0 10 10" aria-hidden>
      <path d="m1 1 8 8M9 1 1 9" stroke="currentColor" />
    </svg>
  );
}

export function NE() {
  return (
    <svg viewBox="0 0 10 10" width="8" height="8" aria-hidden>
      <path d="M1 9 9 1M3 1h6v6" stroke="currentColor" fill="none" />
    </svg>
  );
}
