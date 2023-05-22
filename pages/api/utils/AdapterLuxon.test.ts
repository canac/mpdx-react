import { DateTime } from 'luxon';
import { AdapterLuxon } from './AdapterLuxon';

const dateFromISO = (date: DateTime) => date.toISO().slice(0, 10);

describe('AdapterLuxon', () => {
  const adapter = new AdapterLuxon({ locale: 'en-US' });

  describe('getWeekdays', () => {
    it('returns weekdays starting with Sunday', () => {
      expect(adapter.getWeekdays().join('')).toEqual('SMTWTFS');
    });
  });

  describe('getWeekArray', () => {
    it('returns the weeks in a month', () => {
      expect(
        adapter
          .getWeekArray(DateTime.fromISO('2023-05-16'))
          .map((week) => week.map((day) => dateFromISO(day)).join(',')),
      ).toEqual([
        '2023-04-30,2023-05-01,2023-05-02,2023-05-03,2023-05-04,2023-05-05,2023-05-06',
        '2023-05-07,2023-05-08,2023-05-09,2023-05-10,2023-05-11,2023-05-12,2023-05-13',
        '2023-05-14,2023-05-15,2023-05-16,2023-05-17,2023-05-18,2023-05-19,2023-05-20',
        '2023-05-21,2023-05-22,2023-05-23,2023-05-24,2023-05-25,2023-05-26,2023-05-27',
        '2023-05-28,2023-05-29,2023-05-30,2023-05-31,2023-06-01,2023-06-02,2023-06-03',
      ]);
    });

    it('removes the empty week when the first day of the month is Sunday', () => {
      expect(
        adapter
          .getWeekArray(DateTime.fromISO('2023-01-01'))
          .map((week) => week.map((day) => dateFromISO(day)).join(',')),
      ).toEqual([
        '2023-01-01,2023-01-02,2023-01-03,2023-01-04,2023-01-05,2023-01-06,2023-01-07',
        '2023-01-08,2023-01-09,2023-01-10,2023-01-11,2023-01-12,2023-01-13,2023-01-14',
        '2023-01-15,2023-01-16,2023-01-17,2023-01-18,2023-01-19,2023-01-20,2023-01-21',
        '2023-01-22,2023-01-23,2023-01-24,2023-01-25,2023-01-26,2023-01-27,2023-01-28',
        '2023-01-29,2023-01-30,2023-01-31,2023-02-01,2023-02-02,2023-02-03,2023-02-04',
      ]);
    });

    it('removes the empty week the last day of the month is Saturday', () => {
      expect(
        adapter
          .getWeekArray(DateTime.fromISO('2022-12-31'))
          .map((week) => week.map((day) => dateFromISO(day)).join(',')),
      ).toEqual([
        '2022-11-27,2022-11-28,2022-11-29,2022-11-30,2022-12-01,2022-12-02,2022-12-03',
        '2022-12-04,2022-12-05,2022-12-06,2022-12-07,2022-12-08,2022-12-09,2022-12-10',
        '2022-12-11,2022-12-12,2022-12-13,2022-12-14,2022-12-15,2022-12-16,2022-12-17',
        '2022-12-18,2022-12-19,2022-12-20,2022-12-21,2022-12-22,2022-12-23,2022-12-24',
        '2022-12-25,2022-12-26,2022-12-27,2022-12-28,2022-12-29,2022-12-30,2022-12-31',
      ]);
    });
  });
});
