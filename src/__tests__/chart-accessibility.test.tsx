/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CategoryDonutChart } from '@/components/dashboard/CategoryDonutChart';
import { ComparisonBarChart } from '@/components/dashboard/ComparisonBarChart';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <svg role="presentation">{children}</svg>,
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => <svg role="presentation">{children}</svg>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
}));

describe('accessible chart components', () => {
  test('CategoryDonutChart exposes screen reader summary', () => {
    render(
      <CategoryDonutChart
        breakdown={{
          transport: 340,
          energy: 200,
          food: 100,
          shopping: 50,
          waste: 10,
        }}
      />
    );

    expect(screen.getAllByText(/Transport contributes/i).length).toBeGreaterThan(0);
    const chart = screen.getByRole('img');
    expect(chart.getAttribute('aria-label')).toContain('Transport contributes');
  });

  test('ComparisonBarChart exposes benchmark summary', () => {
    render(<ComparisonBarChart total={2500} />);

    expect(screen.getAllByText(/2,500 kg CO2e/i).length).toBeGreaterThan(0);
    const chart = screen.getByRole('img');
    expect(chart.getAttribute('aria-label')).toContain('2,500');
  });
});
