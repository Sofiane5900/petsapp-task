import { DateTime } from 'luxon';

/**
 * Normalises a PMS date string to ISO 8601 UTC.
 *
 * Supports: ISO 8601, DD/MM/YYYY (slash = day-first), MM-DD-YYYY (dash = month-first).
 * Returns `null` for unparseable inputs so callers can log/skip gracefully.
 *
 * @param raw - Raw date string from the PMS.
 * @returns ISO 8601 UTC string, or `null` if unparseable.
 *
 * @example
 * normaliseAppointmentDate('2026-04-14T09:00:00Z') // "2026-04-14T09:00:00.000Z"
 * normaliseAppointmentDate('14/04/2026')            // "2026-04-14T00:00:00.000Z"
 * normaliseAppointmentDate('04-14-2026')            // "2026-04-14T00:00:00.000Z"
 * normaliseAppointmentDate('not-a-date')            // null
 */
export function normaliseAppointmentDate(raw: string): string | null {
    if (!raw || typeof raw !== 'string') return null;

    const trimmed = raw.trim();

    if (trimmed.includes('/')) {
        return DateTime.fromFormat(trimmed, 'dd/MM/yyyy', { zone: 'utc' }).toISO();
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(trimmed)) {
        return DateTime.fromFormat(trimmed, 'MM-dd-yyyy', { zone: 'utc' }).toISO();
    }

    const iso = DateTime.fromISO(trimmed, { zone: 'utc' });
    return iso.isValid ? iso.toISO() : null;
}
