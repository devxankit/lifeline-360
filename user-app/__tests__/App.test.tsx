/**
 * @format
 */

import { firstName, greeting, rupees } from '../src/utils/format';
import { nextDays, slotsFor } from '../src/data/catalog';

jest.mock('react-native', () => ({}));

test('formats rupees, including discounts', () => {
  expect(rupees(1499)).toBe('₹1,499');
  expect(rupees(-250)).toBe('− ₹250');
  expect(rupees(null)).toBe('—');
});

test('greets by time of day', () => {
  expect(greeting(new Date(2026, 0, 1, 9))).toBe('Good morning');
  expect(greeting(new Date(2026, 0, 1, 14))).toBe('Good afternoon');
  expect(greeting(new Date(2026, 0, 1, 20))).toBe('Good evening');
});

test('uses the first name, with a fallback', () => {
  expect(firstName('Ananya Rao')).toBe('Ananya');
  expect(firstName('')).toBe('there');
});

test('builds booking days and slots', () => {
  const days = nextDays(3);
  expect(days[0].label).toBe('Today');
  expect(days[1].label).toBe('Tomorrow');
  const today = slotsFor(0);
  expect(today.flatMap((g) => g.slots).some((s) => s.taken)).toBe(true);
});
