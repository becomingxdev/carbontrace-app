import { calculateTotalFootprint } from '@/lib/carbon-calculator';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: unknown }) => children,
  PieChart: ({ children }: { children: unknown }) => children,
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({ children }: { children: unknown }) => children,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
}));

describe('dynamic chart module safety', () => {
  test('chart modules export renderable components', async () => {
    const { CategoryDonutChart } = await import('@/components/dashboard/CategoryDonutChart');
    const { ComparisonBarChart } = await import('@/components/dashboard/ComparisonBarChart');

    expect(typeof CategoryDonutChart).toBe('function');
    expect(typeof ComparisonBarChart).toBe('function');
    expect(typeof calculateTotalFootprint).toBe('function');
  });
});
