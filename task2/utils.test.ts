import { normaliseAppointmentDate } from './utils';

describe('normaliseAppointmentDate', () => {
  it('parses ISO 8601 with Z suffix', () => {
    expect(normaliseAppointmentDate('2026-04-14T09:00:00Z')).toBe(
      '2026-04-14T09:00:00.000Z',
    );
  });

  it('parses ISO 8601 with timezone offset', () => {
    expect(normaliseAppointmentDate('2026-04-14T09:00:00+02:00')).toBe(
      '2026-04-14T07:00:00.000Z',
    );
  });

  it('parses ISO 8601 date-only string', () => {
    expect(normaliseAppointmentDate('2026-04-14')).toBe(
      '2026-04-14T00:00:00.000Z',
    );
  });

  it('parses DD/MM/YYYY', () => {
    expect(normaliseAppointmentDate('14/04/2026')).toBe(
      '2026-04-14T00:00:00.000Z',
    );
  });

  it('parses MM-DD-YYYY', () => {
    expect(normaliseAppointmentDate('04-14-2026')).toBe(
      '2026-04-14T00:00:00.000Z',
    );
  });

  it('trims whitespace before parsing', () => {
    expect(normaliseAppointmentDate('  14/04/2026  ')).toBe(
      '2026-04-14T00:00:00.000Z',
    );
  });

  it('returns null for unparseable strings', () => {
    expect(normaliseAppointmentDate('not-a-date')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(normaliseAppointmentDate('')).toBeNull();
  });

  it('returns null for invalid calendar dates', () => {
    expect(normaliseAppointmentDate('31/02/2026')).toBeNull();
    expect(normaliseAppointmentDate('02-31-2026')).toBeNull();
  });

  it('disambiguates slash = day-first, dash = month-first', () => {
    // 01/02/2026 → day=01, month=02 → 1 Feb (DD/MM/YYYY)
    expect(normaliseAppointmentDate('01/02/2026')).toBe(
      '2026-02-01T00:00:00.000Z',
    );
    // 01-02-2026 → month=01, day=02 → 2 Jan (MM-DD-YYYY)
    expect(normaliseAppointmentDate('01-02-2026')).toBe(
      '2026-01-02T00:00:00.000Z',
    );
  });

  it('returns null for mixed-separator gibberish', () => {
    expect(normaliseAppointmentDate('14-04/2026')).toBeNull();
  });
});
