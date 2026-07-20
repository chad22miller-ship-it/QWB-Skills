/************************************************************
 * QWB Pipeline Board — Web App bridge
 * Paste this into your Command Center's Apps Script as a NEW
 * script file, save, then Deploy as a Web App (steps in chat).
 * It lets the live HTML board READ all prospects and WRITE
 * stage moves, message edits, and pending status back to the
 * Prospects tab. Reads/writes ONLY the Prospects tab.
 ************************************************************/

var QWB_SHEET_ID = '18zwTPon2SoHyXSvj13DEI54_XHSoLP66qCI6is6btCI';
var QWB_TAB = 'Prospects';

function _qwbSheet_() {
  return SpreadsheetApp.openById(QWB_SHEET_ID).getSheetByName(QWB_TAB);
}

/* READ — returns every prospect as JSON (JSONP when ?callback= is present) */
function doGet(e) {
  var sh = _qwbSheet_();
  var values = sh.getDataRange().getValues();
  var H = values[0].map(function (h) { return String(h).trim(); });
  var col = function (n) { return H.indexOf(n); };
  var iName = col('Name'), iUrl = col('Profile URL'), iRole = col('Headline / Role'),
      iStatus = col('Status'), iSub = col('Board Sub-Status'), iLast = col('Date of Last Touch'),
      iCN = col('Connection Note'), iM1 = col('Message 1 (Touch 2) Text'),
      iT3 = col('Touch 3 (Bridge Ask) Text'), iS4 = col('Stage 4 Next-Move Text');

  var rows = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (!row[iName]) continue;
    var lastVal = iLast > -1 ? row[iLast] : '';
    if (lastVal instanceof Date) { lastVal = (lastVal.getMonth()+1)+'/'+lastVal.getDate()+'/'+lastVal.getFullYear(); }
    rows.push({
      name: row[iName], url: row[iUrl], role: iRole > -1 ? row[iRole] : '',
      status: row[iStatus], sub: iSub > -1 ? row[iSub] : '', last: lastVal,
      cn: iCN > -1 ? row[iCN] : '', m1: iM1 > -1 ? row[iM1] : '',
      t3: iT3 > -1 ? row[iT3] : '', s4: iS4 > -1 ? row[iS4] : ''
    });
  }
  var payload = JSON.stringify({ ok: true, rows: rows });
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + payload + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload)
    .setMimeType(ContentService.MimeType.JSON);
}

/* WRITE — updates one row (matched by Profile URL): status, sub-status, and/or message */
function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); }
  catch (err) { data = e.parameter || {}; }

  var sh = _qwbSheet_();
  var values = sh.getDataRange().getValues();
  var H = values[0].map(function (h) { return String(h).trim(); });
  var col = function (n) { return H.indexOf(n); };
  var iUrl = col('Profile URL'), iStatus = col('Status');

  var iSub = col('Board Sub-Status');
  if (iSub < 0) { iSub = H.length; sh.getRange(1, iSub + 1).setValue('Board Sub-Status'); }

  var stageCol = {
    'Connection Sent': 'Connection Note',
    'Connected': 'Message 1 (Touch 2) Text',
    'Msg 1 Sent': 'Message 1 (Touch 2) Text',
    'Msg 2 Sent': 'Touch 3 (Bridge Ask) Text',
    'Lane A': 'Stage 4 Next-Move Text',
    'Slow Lane': 'Message 1 (Touch 2) Text'
  };

  var target = String(data.url || '').trim();
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][iUrl]).trim() === target) {
      var rowNum = r + 1;
      if (data.status) sh.getRange(rowNum, iStatus + 1).setValue(data.status);
      if (data.sub != null) sh.getRange(rowNum, iSub + 1).setValue(data.sub);
      if (data.message != null) {
        var stName = data.status || values[r][iStatus];
        var cname = stageCol[stName] || 'Message 1 (Touch 2) Text';
        var mc = col(cname);
        if (mc > -1) sh.getRange(rowNum, mc + 1).setValue(data.message);
      }
      return ContentService.createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: false, err: 'not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}
