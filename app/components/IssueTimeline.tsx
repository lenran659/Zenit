'use client';

import { Fragment, useMemo } from 'react';
import type { Issue, User } from '../types';

type Props = {
  issues: Issue[];
  users: User[];
};

function toDateOnlyIso(input: string) {
  const d = new Date(input);
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();
  return iso;
}

function startOfWeekUtc(date: Date) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diff = (day + 6) % 7; // Monday=0
  d.setUTCDate(d.getUTCDate() - diff);
  return d;
}

function addDaysUtc(date: Date, days: number) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

export default function IssueTimeline({ issues, users }: Props) {
  const assigneeNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const u of users) m.set(u.id, u.name);
    return m;
  }, [users]);

  const normalized = useMemo(() => {
    return issues.map((i) => {
      const start = i.startDate ?? i.createdAt;
      const end = i.endDate ?? i.updatedAt;
      return {
        ...i,
        _start: new Date(toDateOnlyIso(start)),
        _end: new Date(toDateOnlyIso(end)),
      };
    });
  }, [issues]);

  const range = useMemo(() => {
    if (normalized.length === 0) return null;
    let min = normalized[0]._start;
    let max = normalized[0]._end;
    for (const i of normalized) {
      if (i._start < min) min = i._start;
      if (i._end > max) max = i._end;
    }

    const start = startOfWeekUtc(min);
    const end = addDaysUtc(startOfWeekUtc(addDaysUtc(max, 6)), 7); // next week boundary

    const weeks: Date[] = [];
    let cur = new Date(start);
    while (cur < end && weeks.length < 16) {
      weeks.push(new Date(cur));
      cur = addDaysUtc(cur, 7);
    }

    return { start, end, weeks };
  }, [normalized]);

  if (!range) {
    return (
      <div className="border border-border bg-background rounded-lg p-8 text-center text-muted-foreground">
        暂无 Issues
      </div>
    );
  }

  const totalDays = Math.max(1, Math.round((range.end.getTime() - range.start.getTime()) / 86400000));

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <div className="border-b border-border bg-muted/40 px-4 py-3">
        <div className="text-muted-foreground text-sm">Timeline（按周）</div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid" style={{ gridTemplateColumns: `320px repeat(${range.weeks.length}, 1fr)` }}>
            <div className="px-4 py-3 text-xs text-muted-foreground border-b border-border">Issue</div>
            {range.weeks.map((w) => (
              <div
                key={w.toISOString()}
                className="px-3 py-3 text-xs text-muted-foreground border-b border-border"
              >
                {w.toISOString().slice(0, 10)}
              </div>
            ))}

            {normalized.map((i) => {
              const startDays = Math.floor((i._start.getTime() - range.start.getTime()) / 86400000);
              const endDays = Math.max(startDays + 1, Math.ceil((i._end.getTime() - range.start.getTime()) / 86400000) + 1);

              const leftPct = Math.max(0, (startDays / totalDays) * 100);
              const widthPct = Math.min(100 - leftPct, ((endDays - startDays) / totalDays) * 100);

              const assignee = i.assigneeId ? assigneeNameById.get(i.assigneeId) : undefined;

              return (
                <Fragment key={i.id}>
                  <div className="px-4 py-3 border-b border-border">
                    <div className="text-foreground text-sm truncate">{i.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 truncate">
                      {i.type.toUpperCase()} · {assignee ?? '-'}
                    </div>
                  </div>
                  <div className="relative border-b border-border col-span-full" style={{ gridColumn: `2 / span ${range.weeks.length}` }}>
                    <div className="relative h-12">
                      <div
                        className={`absolute top-3 h-6 rounded ${i.type === 'bug' ? 'bg-red-500/25 border border-red-500/40' : 'bg-cyan-500/20 border border-cyan-500/40'}`}
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
