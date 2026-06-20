import { parseNumericInput, createFieldChangeHandler } from '@/lib/input-utils';

describe('parseNumericInput', () => {
  test('parses standard positive integer strings', () => {
    expect(parseNumericInput('15')).toBe(15);
  });

  test('parses standard positive float strings', () => {
    expect(parseNumericInput('12.34')).toBe(12.34);
  });

  test('clamps negative values to zero', () => {
    expect(parseNumericInput('-5')).toBe(0);
    expect(parseNumericInput('-12.5')).toBe(0);
  });

  test('returns zero for invalid non-numeric strings', () => {
    expect(parseNumericInput('invalid')).toBe(0);
    expect(parseNumericInput('abc')).toBe(0);
  });

  test('returns zero for empty strings', () => {
    expect(parseNumericInput('')).toBe(0);
  });
});

describe('createFieldChangeHandler', () => {
  test('creates a handler that parses numeric input and triggers onChange callback', () => {
    const mockData = {
      carKmPerWeek: 10,
      busKmPerWeek: 20,
    };
    const mockOnChange = jest.fn();

    const handler = createFieldChangeHandler('carKmPerWeek', mockData, mockOnChange);
    handler('45');

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith({
      carKmPerWeek: 45,
      busKmPerWeek: 20,
    });
  });

  test('handles invalid inputs gracefully and clamps to zero inside the handler', () => {
    const mockData = {
      carKmPerWeek: 10,
      busKmPerWeek: 20,
    };
    const mockOnChange = jest.fn();

    const handler = createFieldChangeHandler('carKmPerWeek', mockData, mockOnChange);
    handler('-10');

    expect(mockOnChange).toHaveBeenCalledWith({
      carKmPerWeek: 0,
      busKmPerWeek: 20,
    });
  });
});
