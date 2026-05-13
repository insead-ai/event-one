// ============================================
// GOOGLE APPS SCRIPT - INSEAD AI Club Event 1
// Handles BOTH signup.html and feedback.html submissions.
// Routes by `formType` field in the JSON payload:
//   - 'feedback'  -> sheet "Feedback"
//   - anything else (default, signup) -> first sheet (the existing Signups one)
//
// Paste this into Apps Script (script.google.com), bind to the Google Sheet,
// then deploy as Web App (Execute as: Me, Access: Anyone). Save and re-deploy
// to upgrade the existing deployment - the SCRIPT_URL in signup.html and
// feedback.html stays the same.
// ============================================

const SIGNUP_SHEET_NAME = null; // null = first sheet, keeps backward-compat
const FEEDBACK_SHEET_NAME = 'Feedback';

const SIGNUP_HEADERS = [
  'Timestamp',
  'Name',
  'Section',
  'Email',
  'Coming',
  'What I\'d most like to learn',
  'Event'
];
const SIGNUP_KEYS = [
  'timestamp', 'name', 'section', 'email', 'coming', 'learn', 'event'
];

const FEEDBACK_HEADERS = [
  'Timestamp',
  'Rating (1-5)',
  'Level',
  'What was good',
  'What would you change',
  'Name',
  'Section',
  'Event'
];
const FEEDBACK_KEYS = [
  'timestamp', 'rating', 'level', 'good', 'change', 'name', 'section', 'event'
];

function getOrCreateSheet(spreadsheet, name, headers) {
  let sheet;
  if (name === null) {
    sheet = spreadsheet.getActiveSheet();
  } else {
    sheet = spreadsheet.getSheetByName(name);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(name);
    }
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  let sheet, keys;
  if (data.formType === 'feedback') {
    sheet = getOrCreateSheet(spreadsheet, FEEDBACK_SHEET_NAME, FEEDBACK_HEADERS);
    keys = FEEDBACK_KEYS;
  } else {
    sheet = getOrCreateSheet(spreadsheet, SIGNUP_SHEET_NAME, SIGNUP_HEADERS);
    keys = SIGNUP_KEYS;
  }

  const row = keys.map(key => data[key] !== undefined ? data[key] : '');
  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', formType: data.formType || 'signup' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Required for CORS preflight / sanity-check the deployment URL in browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', service: 'event-one signup + feedback' }))
    .setMimeType(ContentService.MimeType.JSON);
}
