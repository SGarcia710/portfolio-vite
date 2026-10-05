import { useEffect, useState, type RefObject } from 'react';
import { experiences, toYearFraction } from '../../../content/experience';

export const AXIS_HEIGHT = 36;
export const ROW_HEIGHT = 34;
export const ROW_GAP = 12;
export const TRACK_PADDING = 48;
/** Room after the last year so labels of recent roles never clip. */
export const TRACK_TAIL = 150;
const MIN_YEAR_WIDTH = 118;

export interface TimelineScale {
  startYear: number;
  endYear: number;
  yearWidth: number;
  width: number;
  height: number;
  now: number;
  x: (year: number) => number;
}

/** Maps career years onto horizontal pixels, filling the container when there is room. */
export function useTimelineScale(container: RefObject<HTMLElement>): TimelineScale {
  const [available, setAvailable] = useState(1200);

  useEffect(() => {
    const element = container.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setAvailable(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, [container]);

  const now = toYearFraction(new Date());
  const startYear = Math.floor(Math.min(...experiences.map((role) => toYearFraction(role.start))));
  const endYear = Math.floor(now) + 2;
  const span = endYear - startYear;
  const yearWidth = Math.max(MIN_YEAR_WIDTH, (available - TRACK_PADDING - TRACK_TAIL) / span);
  const x = (year: number) => TRACK_PADDING + (year - startYear) * yearWidth;

  return {
    startYear,
    endYear,
    yearWidth,
    now,
    x,
    width: x(endYear) + TRACK_TAIL,
    height: AXIS_HEIGHT + TRACK_PADDING + experiences.length * (ROW_HEIGHT + ROW_GAP),
  };
}
