// ============================================
// GOOGLE APPS SCRIPT - INSEAD AI Club Event 1 signup
// Paste this into Apps Script (script.google.com), bind to a Google Sheet,
// then deploy as Web App (Execute as: Me, Access: Anyone)
// ============================================

const HEADERS = [
  'Timestamp',
  'Name',
  'Section',
  'Email',
  'Coming',
  'What I\'d most like to learn',
  'Event'
];

const KEYS = [
  'timestamp',
  'name',
  'section',
  'email',
  'coming',
  'learn',
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

// Required for CORS preflight (and useful for sanity-checking the deployment URL in browser)
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'event-one signup' }))
    .setMimeType(ContentService.MimeType.JSON);
}
