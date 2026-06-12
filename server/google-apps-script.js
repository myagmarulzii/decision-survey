/**
 * ===========================================
 * Google Apps Script - Survey Data Server
 * ===========================================
 *
 * ТОХИРУУЛАХ ЗААВАР:
 *
 * 1. https://script.google.com руу орно
 * 2. "New Project" дарна
 * 3. Доорх кодыг бүгдийг copy-paste хийнэ
 * 4. "Deploy" > "New deployment" дарна
 * 5. Type: "Web app" сонгоно
 * 6. Execute as: "Me"
 * 7. Who has access: "Anyone"
 * 8. "Deploy" дарна
 * 9. URL-ийг хуулж авна (жнь: https://script.google.com/macros/s/xxxxx/exec)
 * 10. Тэр URL-ийг PWA аппын Админ хэсэгт оруулна
 *
 * Google Sheet автоматаар үүснэ.
 */

const SHEET_NAME = 'Survey Responses';
const SPREADSHEET_NAME = 'Decision Survey Data';

function getOrCreateSpreadsheet() {
  const files = DriveApp.getFilesByName(SPREADSHEET_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  const ss = SpreadsheetApp.create(SPREADSHEET_NAME);
  const sheet = ss.getActiveSheet();
  sheet.setName(SHEET_NAME);

  const headers = [
    'participant_id', 'questionnaire', 'question_order', 'question_id',
    'question_text', 'answer', 'timestamp', 'survey_start', 'survey_end',
    'total_time_seconds', 'completed', 'risk_score', 'patience_score',
    'satisfaction_score', 'satisfaction_group', 'satisfaction_reason',
    'satisfaction_specify', 'rational_score', 'avoidant_score',
    'dependent_score', 'intuitive_score',
    'device_id', 'synced_at'
  ];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  return ss;
}

function getSheet() {
  const ss = getOrCreateSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet();
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const rows = data.rows;
    const deviceId = data.device_id || 'unknown';
    const syncedAt = new Date().toISOString();

    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return jsonResponse({ success: false, error: 'No rows provided' });
    }

    const sheet = getSheet();
    const headers = [
      'participant_id', 'questionnaire', 'question_order', 'question_id',
      'question_text', 'answer', 'timestamp', 'survey_start', 'survey_end',
      'total_time_seconds', 'completed', 'risk_score', 'patience_score',
      'satisfaction_score', 'satisfaction_group', 'satisfaction_reason',
      'satisfaction_specify', 'rational_score', 'avoidant_score',
      'dependent_score', 'intuitive_score'
    ];

    // Duplicate шалгах: device_id + participant_id + timestamp
    const existingData = sheet.getDataRange().getValues();
    const existingKeys = new Set();
    for (let i = 1; i < existingData.length; i++) {
      const key = existingData[i][21] + '|' + existingData[i][0] + '|' + existingData[i][6]; // device_id|participant_id|timestamp
      existingKeys.add(key);
    }

    let addedCount = 0;

    for (const row of rows) {
      const key = deviceId + '|' + (row.participant_id || '') + '|' + (row.timestamp || '');
      if (existingKeys.has(key)) continue; // skip duplicate

      const values = headers.map(h => row[h] || '');
      values.push(deviceId);
      values.push(syncedAt);
      sheet.appendRow(values);
      addedCount++;
    }

    SpreadsheetApp.flush();

    return jsonResponse({
      success: true,
      added: addedCount,
      synced_at: syncedAt
    });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'status';

  if (action === 'status') {
    try {
      const sheet = getSheet();
      const rowCount = Math.max(0, sheet.getLastRow() - 1);
      return jsonResponse({
        success: true,
        status: 'online',
        total_rows: rowCount
      });
    } catch (err) {
      return jsonResponse({ success: true, status: 'online', total_rows: 0 });
    }
  }

  if (action === 'download') {
    try {
      const sheet = getSheet();
      const data = sheet.getDataRange().getValues();
      const csv = data.map(row =>
        row.map(cell => {
          const val = String(cell);
          if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return '"' + val.replace(/"/g, '""') + '"';
          }
          return val;
        }).join(',')
      ).join('\n');

      return ContentService.createTextOutput(csv)
        .setMimeType(ContentService.MimeType.CSV);
    } catch (err) {
      return jsonResponse({ success: false, error: err.message });
    }
  }

  return jsonResponse({ success: false, error: 'Unknown action' });
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
