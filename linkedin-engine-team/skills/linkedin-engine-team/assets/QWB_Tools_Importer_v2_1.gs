// QWB Tools Wave Importer v2.2 — Changes-Only Format + One-Shot Wave Lockout (7/17/2026)
// v2.1 fixed the file lookup (getFilesByName cannot take a regex, so v2.0 never found a wave).
// v2.2 adds: (a) a watermark so a wave can never be imported twice, (b) an archive-all sweep
//   that moves every leftover wave into Imported after a successful import, and
//   (c) an on-open hygiene warning if stale (locked-out) wave files are still sitting around.
// Matches by Profile URL, updates only present columns, adds new rows.
// SETUP: In your Command Center sheet: Extensions -> Apps Script -> replace all code
//   with this file -> set FOLDER_ID to YOUR wave Drive folder -> Save -> refresh sheet.
// NOTE: If you copied the UPDATED team template, this importer (plus the board self-clean,
//   "Clear old rows" button, and nightly rebuild trigger) is already installed — you can skip this.

var FOLDER_ID = 'PASTE_YOUR_WAVE_FOLDER_ID_HERE';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('QWB Tools')
    .addItem('Import newest wave', 'importNewestWave')
    .addSeparator()
    .addItem('Debug: List waves in folder', 'listWavesInFolder')
    .addToUi();
  try { checkWaveFolderHygiene_(); } catch (e) {} // never block the menu on a hygiene error
}

function importNewestWave() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);

    // LOCKOUT: ignore any wave not newer than the last successful import
    const props = PropertiesService.getDocumentProperties();
    const lastImportTs = Number(props.getProperty('QWB_LAST_IMPORT_TS') || 0);

    const files = folder.getFilesByType(MimeType.CSV);
    let newestFile = null;
    let newestTime = 0;

    while (files.hasNext()) {
      const file = files.next();
      if (!/^wave_.*\.csv$/i.test(file.getName())) continue;
      if (file.getLastUpdated().getTime() <= lastImportTs) continue; // locked out: not newer than last import
      if (file.getLastUpdated().getTime() > newestTime) {
        newestTime = file.getLastUpdated().getTime();
        newestFile = file;
      }
    }

    if (!newestFile) {
      showDialog('No NEW wave file found. Waves from before the last successful import are locked out forever. Upload a fresh wave_*.csv to your wave folder.');
      return;
    }

    const csvData = newestFile.getBlob().getDataAsString();
    const rows = csvData.split('\n').filter(function(row){return row.trim()});

    if (rows.length < 2) {
      showDialog('Wave file is empty. Need header + at least 1 data row.');
      return;
    }

    const headerRow = parseCSVLine(rows[0]);
    const nameIdx = headerRow.indexOf('Name');
    const profileUrlIdx = headerRow.indexOf('Profile URL');

    if (nameIdx === -1 || profileUrlIdx === -1) {
      showDialog('ERROR: Wave file missing "Name" or "Profile URL" column.');
      return;
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Prospects');
    if (!sheet) {
      showDialog('ERROR: Cannot find Prospects sheet.');
      return;
    }

    const trackerHeader = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const trackerData = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    const tUrlIdx = trackerHeader.indexOf('Profile URL');

    const columnMap = {};
    headerRow.forEach(function(waveCol, idx) {
      const trackerColIdx = trackerHeader.indexOf(waveCol);
      if (trackerColIdx !== -1) columnMap[idx] = trackerColIdx + 1;
    });

    let updated = 0, added = 0, skipped = 0;

    for (let i = 1; i < rows.length; i++) {
      const dataRow = parseCSVLine(rows[i]);
      const name = dataRow[nameIdx] ? dataRow[nameIdx].trim() : '';
      const profileUrl = dataRow[profileUrlIdx] ? dataRow[profileUrlIdx].trim() : '';

      if (!name || !profileUrl) { skipped++; continue; }

      let trackerRowIdx = -1;
      for (let j = 0; j < trackerData.length; j++) {
        const trackerUrl = (trackerData[j][tUrlIdx] || '').toString().trim();
        if (trackerUrl && trackerUrl === profileUrl) { trackerRowIdx = j + 2; break; }
      }

      if (trackerRowIdx === -1) {
        const newRow = new Array(trackerHeader.length).fill('');
        Object.keys(columnMap).forEach(function(waveColIdx) {
          const value = dataRow[waveColIdx] || '';
          if (value) newRow[columnMap[waveColIdx] - 1] = value;
        });
        sheet.appendRow(newRow);
        added++;
        continue;
      }

      let wrote = false;
      Object.keys(columnMap).forEach(function(waveColIdx) {
        const value = dataRow[waveColIdx] || '';
        if (value) {
          sheet.getRange(trackerRowIdx, columnMap[waveColIdx]).setValue(value);
          wrote = true;
        }
      });
      if (wrote) updated++;
    }

    const importedFolder = folder.getFoldersByName('Imported').hasNext()
      ? folder.getFoldersByName('Imported').next()
      : folder.createFolder('Imported');
    newestFile.moveTo(importedFolder);

    // LOCKOUT: remember this import; this data can never be imported again
    props.setProperty('QWB_LAST_IMPORT_TS', String(newestTime));

    // Sweep every remaining wave CSV into Imported so no stale wave is left behind
    let swept = 0;
    const leftovers = folder.getFilesByType(MimeType.CSV);
    while (leftovers.hasNext()) {
      const lf = leftovers.next();
      if (!/^wave_.*\.csv$/i.test(lf.getName())) continue;
      lf.moveTo(importedFolder);
      swept++;
    }

    showDialog('Imported ' + newestFile.getName() + '\nUpdated ' + updated + ' existing, added ' + added + ' new, skipped ' + skipped + '.' + (swept ? '\nSwept ' + swept + ' stale wave file(s) into Imported.' : ''));

  } catch (error) {
    showDialog('ERROR: ' + error.toString());
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map(function(v){return v.trim()});
}

function showDialog(message) {
  const ui = SpreadsheetApp.getUi();
  const htmlOutput = HtmlService.createHtmlOutput('<p>' + message.replace(/\n/g, '<br>') + '</p><button onclick="google.script.host.close()">OK</button>');
  ui.showModelessDialog(htmlOutput, 'QWB Tools');
}

function listWavesInFolder() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFilesByType('text/csv');
  let list = 'Wave files:\n';
  while (files.hasNext()) {
    const file = files.next();
    list += '- ' + file.getName() + ' (' + new Date(file.getLastUpdated()).toLocaleString() + ')\n';
  }
  showDialog(list);
}

// On sheet open, warn if stale (locked-out) wave files are sitting in the folder
function checkWaveFolderHygiene_() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const props = PropertiesService.getDocumentProperties();
  const lastImportTs = Number(props.getProperty('QWB_LAST_IMPORT_TS') || 0);
  const files = folder.getFilesByType(MimeType.CSV);
  let fresh = 0, stale = 0;
  const staleNames = [];
  while (files.hasNext()) {
    const f = files.next();
    if (!/^wave_.*\.csv$/i.test(f.getName())) continue;
    if (f.getLastUpdated().getTime() <= lastImportTs) { stale++; staleNames.push(f.getName()); }
    else fresh++;
  }
  if (stale > 0) {
    showDialog('FOLDER HYGIENE WARNING\n' + stale + ' stale wave file(s) (locked out, will never import):\n- ' + staleNames.join('\n- ') + '\nThey will be swept into Imported on the next successful import.' + (fresh ? '\n' + fresh + ' fresh wave(s) ready to import.' : ''));
  }
}
