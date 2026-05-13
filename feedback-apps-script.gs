// ============================================
// GOOGLE APPS SCRIPT - INSEAD AI Club Event 1 FEEDBACK
//
// This is a STANDALONE script for feedback only - completely separate
// from the signup Apps Script. Lives in its own spreadsheet.
//
// Setup:
// 1. Open Google Sheets, create a new blank spreadsheet
//    Title it: "AI Club Event 01 - Feedback"
// 2. Menu: Extensions > Apps Script
// 3. Replace all the default code with this file's contents
// 4. Save (Cmd+S), name the project "AI Club Feedback"
// 5. Deploy > New deployment > Type: Web app
//      Execute as: Me
//      Who has access: Anyone
//    Click Deploy, authorise the Google permissions prompt
// 6. Copy the Web App URL it gives you
// 7. Paste it into feedback.html (replace SCRIPT_URL placeholder)
// ============================================

const HEADERS = [
  'Timestamp',
  'Rating (1-5)',
  'Level',
  'What was good',
  'What would you change',
  'Name',
  'Section',
  'Event'
];

const KEYS = [
  'timestamp',
  'rating',
  'level',
  'good',
  'change',
  'name',
  'section',
  'event'
];

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Add headers if first row is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  const data = JSON.parse(e.postData.contents);

  // Build row in header order, defaulting missing fields to empty string
  const row = KEYS.map(key => data[key] !== undefined ? data[key] : '');

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Required for CORS preflight + sanity-check the deployment URL in browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'event-one feedback' }))
    .setMimeType(ContentService.MimeType.JSON);
}
