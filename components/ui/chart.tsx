'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

import { cn } from '@/lib/utils';

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error('Chart components must be used within <ChartContainer />');
  }
  return ctx;
}

export function ChartContainer({
  config,
  className,
  children,
}: React.PropsWithChildren<{ config: ChartConfig; className?: string }>) {
  const style = React.useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(config)) {
      if (value.color) vars[`--color-${key}`] = value.color;
    }
    return vars as React.CSSProperties;
  }, [config]);

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        className={cn('w-full', className)}
        style={style}
      >
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function getPayloadKey(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  if ('dataKey' in payload && typeof (payload as { dataKey?: unknown }).dataKey === 'string') {
    return (payload as { dataKey: string }).dataKey;
  }
  if ('name' in payload && typeof (payload as { name?: unknown }).name === 'string') {
    return (payload as { name: string }).name;
  }
  return null;
}

export function ChartTooltip({ ...props }: React.ComponentProps<typeof Tooltip>) {
  return <Tooltip {...props} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  labelFormatter,
}: {
  active?: boolean;
  payload?: Array<Record<string, unknown>>;
  label?: unknown;
  className?: string;
  labelFormatter?: (label: unknown) => string;
  indicator?: 'dot' | 'line' | 'dashed';
}) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className={cn('rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm', className)}>
      {label ? (
        <div className="mb-1 text-xs text-muted-foreground">{labelFormatter ? labelFormatter(label) : String(label)}</div>
      ) : null}
      <div className="space-y-1">
        {payload.map((item, idx) => {
          const key = getPayloadKey(item);
          const meta = key ? config[key] : undefined;
          const color = key ? `var(--color-${key})` : undefined;
          const value = (item as { value?: unknown }).value;
          return (
            <div key={`${key ?? 'item'}-${idx}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: color ?? ((item as { color?: unknown }).color as string | undefined) }}
                />
                <span className="truncate">{String(meta?.label ?? key ?? (item as { name?: unknown }).name ?? '')}</span>
              </div>
              <span className="font-medium tabular-nums">{value == null ? '-' : String(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ChartLegend({ ...props }: React.ComponentProps<typeof Legend>) {
  return <Legend {...props} />;
}

export function ChartLegendContent({
  payload,
  className,
}: {
  payload?: Array<Record<string, unknown>>;
  className?: string;
}) {
  const { config } = useChart();

  if (!payload || payload.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground', className)}>
      {payload.map((entry, idx) => {
        const key =
          typeof (entry as { dataKey?: unknown }).dataKey === 'string'
            ? ((entry as { dataKey: string }).dataKey as string)
            : typeof (entry as { value?: unknown }).value === 'string'
              ? ((entry as { value: string }).value as string)
              : null;
        const meta = key ? config[key] : undefined;
        const color = key ? `var(--color-${key})` : undefined;
        return (
          <div key={`${key ?? 'legend'}-${idx}`} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: color ?? ((entry as { color?: unknown }).color as string | undefined) }}
            />
            <span>{meta?.label ?? key ?? '—'}</span>
          </div>
        );
      })}
    </div>
  );
}
