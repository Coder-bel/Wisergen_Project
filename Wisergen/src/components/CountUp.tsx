import { useState, useEffect, useRef } from 'react';

// Counts a single stat up from 0 to its target when it scrolls into view.
// Values like "250+" animate (250, then "+" re-appended). "24/7" stays static.
// `className` lets each page style the number to match its surroundings.
export default function CountUp({
  value,
  className = '',
  duration = 1800,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const match = value.match(/^(\d+)(\D*)$/); // number followed by optional suffix
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : '';

  const [display, setDisplay] = useState(target !== null ? 0 : value);
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (target === null) return; // non-numeric (e.g. "24/7") — leave static
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasRun.current) return;
        hasRun.current = true;
        observer.disconnect();

        let startTime: number | null = null;
        const tick = (now: number) => {
          if (startTime === null) startTime = now;
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          setDisplay(Math.round(eased * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {target === null ? value : `${display}${suffix}`}
    </span>
  );
}
