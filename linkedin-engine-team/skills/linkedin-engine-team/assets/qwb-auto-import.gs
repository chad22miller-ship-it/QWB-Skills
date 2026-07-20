/**********************************************************************
 * QWB AUTO-IMPORT  —  UI-free, time-trigger safe.
 * Add this to the Command Center's bound Apps Script
 * (Extensions -> Apps Script), save, then run
 * qwbInstallAutoImportTrigger() ONCE to schedule it every minute.
 *
 * What it does, every minute:
 *  - finds the newest wave_*.csv in the QWB Prospect Finder folder
 *  - matches each row to the Prospects tab BY Profile URL
 *  - maps columns BY EXACT HEADER NAME (position-independent)
 *  - writes ONLY the columns present in the wave, and SKIPS BLANKS
 *    (a blank cell never wipes existing data)
 *  - appends any row whose Profile URL is new
 *  - stamps a watermark and sweeps processed waves to /Imported
 *
 * This REPLACES the need to click "Import newest wave". The menu
 * item can stay as a manual backup; the two won't fight because the
 * first one to run sweeps the file.
 **********************************************************************/

var QWB_SPREADSHEET_ID   = '1uvABw5oJLAvj4zMm5v9BXdeuQeNK4TCUo1hQpM010R4';
var QWB_SHEET_NAME       = 'Prospects';
var QWB_WAVE_FOLDER_ID   = '1HbCcpDIA4hjaGzqVir59Ox6ggL1x36nt';
var QWB_IMPORTED_FOLDER_ID = '1w4KLTbzuGDTsFpBh-_C7Q9GTLiu--ODe';
var QWB_MATCH_HEADER     = 'Profile URL';
var QWB_NAME_HEADER      = 'Name';

function qwbAutoImportNewWave() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return;               // never overlap runs
  try {
    var folder = DriveApp.getFolderById(QWB_WAVE_FOLDER_ID);

    // 1) newest wave_*.csv
    var it = folder.getFiles();
    var newest = null;
    while (it.hasNext()) {
      var f = it.next();
      var n = f.getName();
      if (n.indexOf('wave_') !== 0 || n.slice(-4).toLowerCase() !== '.csv') continue;
      if (!newest || f.getLastUpdated() > newest.getLastUpdated()) newest = f;
    }
    if (!newest) return;

    // 2) watermark guard (don't reprocess)
    var props = PropertiesService.getDocumentProperties();
    var mark = Number(props.getProperty('QWB_IMPORT_WATERMARK') || 0);
    if (newest.getLastUpdated().getTime() <= mark) return;

    // 3) parse wave
    var csv = Utilities.parseCsv(newest.getBlob().getDataAsString('UTF-8'));
    if (!csv || csv.length < 2) { qwbSweep_(folder); return; }
    var waveHeader = csv[0].map(function (h) { return String(h).trim(); });
    var waveUrlIdx  = waveHeader.indexOf(QWB_MATCH_HEADER);
    var waveNameIdx = waveHeader.indexOf(QWB_NAME_HEADER);
    if (waveUrlIdx < 0 || waveNameIdx < 0) return;   // malformed header, leave for inspection

    // 4) tracker snapshot
    var sheet = SpreadsheetApp.openById(QWB_SPREADSHEET_ID).getSheetByName(QWB_SHEET_NAME);
    var data  = sheet.getDataRange().getValues();
    var tHeader = data[0].map(function (h) { return String(h).trim(); });
    var tCol = {};
    tHeader.forEach(function (h, i) { tCol[h] = i; });
    var tUrlCol = tCol[QWB_MATCH_HEADER];
    var urlToRow = {};                               // Profile URL -> 0-based data row
    for (var r = 1; r < data.length; r++) {
      var u = String(data[r][tUrlCol]).trim();
      if (u) urlToRow[u] = r;
    }

    // 5) apply
    var updated = 0, added = 0, skipped = 0;
    for (var w = 1; w < csv.length; w++) {
      var row = csv[w];
      var url  = String(row[waveUrlIdx]  || '').trim();
      var name = String(row[waveNameIdx] || '').trim();
      if (!url || !name) { skipped++; continue; }

      var tr = urlToRow[url];
      if (tr == null) {
        // new prospect -> append (only mapped columns)
        var newRow = [];
        for (var c = 0; c < tHeader.length; c++) newRow.push('');
        waveHeader.forEach(function (h, ci) {
          if (tCol[h] != null) newRow[tCol[h]] = row[ci];
        });
        sheet.appendRow(newRow);
        added++;
        continue;
      }
      // existing -> update mapped, non-blank cells only
      waveHeader.forEach(function (h, ci) {
        var col = tCol[h];
        if (col == null) return;
        var val = row[ci];
        if (val === '' || val == null) return;       // BLANK-SAFE: never wipe
        sheet.getRange(tr + 1, col + 1).setValue(val);
      });
      updated++;
    }

    // 6) watermark + sweep
    props.setProperty('QWB_IMPORT_WATERMARK', String(newest.getLastUpdated().getTime()));
    props.setProperty('QWB_LAST_IMPORT_SUMMARY',
      'updated ' + updated + ', added ' + added + ', skipped ' + skipped + ' @ ' + new Date().toISOString());
    qwbSweep_(folder);
  } finally {
    lock.releaseLock();
  }
}

function qwbSweep_(folder) {
  var imported = DriveApp.getFolderById(QWB_IMPORTED_FOLDER_ID);
  var it = folder.getFiles();
  while (it.hasNext()) {
    var f = it.next();
    var n = f.getName();
    if (n.indexOf('wave_') !== 0 || n.slice(-4).toLowerCase() !== '.csv') continue;
    imported.addFile(f);
    folder.removeFile(f);
  }
}

/** Run ONCE from the editor to schedule the minute trigger. */
function qwbInstallAutoImportTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'qwbAutoImportNewWave') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('qwbAutoImportNewWave').timeBased().everyMinutes(1).create();
}

/** Optional: read the last import result from the editor logs. */
function qwbLastImportSummary() {
  Logger.log(PropertiesService.getDocumentProperties().getProperty('QWB_LAST_IMPORT_SUMMARY') || 'none yet');
}
