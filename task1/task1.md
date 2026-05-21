## Task 1 

### Written Diagnosis 
Judging by what we receive from the logs, the fetching of the appointments is receiving a success response (200). During the parsing of the JSON response the API is receiving, the field "appointmentDate" received an unexpected format. The cause of the error is that the database is waiting for an ISO 8601 standardized date, therefore causing the validation to fail. 

### Questions to ask to the clinic

**This was generated with the use of AI** 

Hi (Name),
Apologies for the trouble — I completely understand how frustrating and disruptive this is for your team, especially since everything was running smoothly last week. We are actively investigating this on our end right now.

To help us pinpoint the cause faster, could you let me know:
— Has your practice management software undergone any recent updates or changes in the last few days?
— Have any system settings (like regional settings, date/time formats) been altered recently?
— Are you seeing any specific error messages or alerts on your screen when you create an appointment? If so, a screenshot would be incredibly helpful.

We will get to the bottom of this and keep you updated shortly.

### The steps you would take internally to investigate and resolve it  
 
1. Look for group_id: 4821 at 2026-04-14 09:02 UTC in the logs to get the full picture.
2. Identify the affected records (003 and 004) and confirm the exact date format mismatch.
3. Check the sync history for this clinic to know if this is a new issue or has it happened before.
4. Check if other clinics using the same PMS are affected.
5. Contact the clinic to confirm if their PMS was recently updated.
6. Once confirmed, implement a date normalizer to handle DD/MM/YYYY to ISO 8601.

### If you were writing a Jira bug ticket based on this, what would it look like?

**This was generated with the use of AI** 
 
**Title:** `[Sync Service] - Partial sync caused by DD/MM/YYYY date format blocks appointment reminders`

**Priority:** High
**Severity:** High

**1. Summary**
Paws & Claws (group_id: 4821) is failing to send appointment reminders to pet owners. Their PMS is sending the `appointmentDate` field in a European format (`DD/MM/YYYY`, e.g., "14/04/2026") instead of the expected ISO 8601 format. These specific records fail validation, resulting in a "partial sync." As a safety mechanism, the downstream notification service skips sending any reminders when a partial sync is flagged.

**2. Steps to Reproduce**
1. Trigger the test sync service for a clinic.
2. Send an appointment payload containing some records with dates formatted as `DD/MM/YYYY`.
3. Observe the sync process output in the logs (validation fails for malformed dates, but valid ones are written).
4. Observe the downstream notification service skipping reminders due to the partial sync flag.

**3. Expected Behavior**
The sync service parser should handle regional date formats like `DD/MM/YYYY` (converting them to ISO 8601) to ensure all records are correctly written, allowing the sync to complete fully and reminders to fire normally.

**4. Actual Behavior**
Records with the `DD/MM/YYYY` format fail validation and are skipped. The sync completes with a "partial success" status, which actively triggers a block on the downstream notification service, preventing all reminders from going out.

**5. Technical Details**
* **Clinic / Group ID:** 4821
* **Affected Records:** 003 and 004
* **Logs:**

```text
[INFO] Starting sync for group_id: 4821
[INFO] Fetching appointments from PMS API...
[INFO] PMS response received: 200 OK
[INFO] Parsing appointment records...
[WARN] Unexpected field format on record 003: "appointmentDate" received "14/04/2026", expected ISO 8601
[WARN] Unexpected field format on record 004: "appointmentDate" received "14/04/2026", expected ISO 8601
[ERROR] Validation failed: 2 of 6 records rejected (invalid date format)
[INFO] Sync completed with partial success: 4 records written, 2 skipped
[INFO] Downstream notification skipped: partial sync flagged, full sync required before reminders fire
```