/**
 * @format
 */

import { driverShareOf, fareBreakdown, nextStage } from '../src/store/DriverStore';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

test('trip moves through every stage in order', () => {
  const order = ['ACCEPTED', 'TO_PICKUP', 'ARRIVED', 'TO_HOSPITAL', 'REACHED', 'COMPLETED'] as const;
  for (let i = 0; i < order.length - 1; i++) {
    expect(nextStage(order[i])).toBe(order[i + 1]);
  }
  expect(nextStage('COMPLETED')).toBe('COMPLETED');
  expect(nextStage('IDLE')).toBe('IDLE');
});

test('fare breakdown always adds up to the fare', () => {
  for (const fare of [450, 1350, 1450, 1850, 5200]) {
    const p = fareBreakdown(fare);
    expect(p.base + p.distance + p.equipment).toBe(fare);
    expect(p.distance).toBeGreaterThanOrEqual(0);
  }
});

test('driver keeps 80% of the fare', () => {
  expect(driverShareOf(1850)).toBe(1480);
  expect(driverShareOf(1450)).toBe(1160);
});
