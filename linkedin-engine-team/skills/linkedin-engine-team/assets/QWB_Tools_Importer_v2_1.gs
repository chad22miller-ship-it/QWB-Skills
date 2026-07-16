// QWB Tools Wave Importer v2.1 — Changes-Only Format (FIXED 7/16/2026)
// Fix: getFilesByName() cannot take a regex — v2.0's importer never found any wave.
// Reads header-keyed CSV waves: Name, Profile URL, + only changed columns.
// Matches by Profile URL, updates only present columns, adds new rows.
// SETUP: In your Command Center sheet: Extensions -> Apps Script -> replace all code
// with this file -> set FOLDER_ID to YOUR wave Drive folder -> Save -> refresh sheet.

var FOLDER_ID = 'PASTE_YOUR_WAVE_FOLDER_ID_HERE';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('QWB Tools')
    .addItem('Import newest wave', 'importNewestWave')
    .addSeparator()
    .addItem('Debug: List waves in folder', 'listWavesInFolder')
    .addToUi();
}

function importNewestWave() {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);

    const files = folder.getFilesByType(MimeType.CSV);
    let newestFile = null;
    let newestTime = 0;

    while (files.hasNext()) {
      const file = files.next();
      if (!/^wave_.*\.csv$/i.test(file.getName())) continue;
      if (file.getLastUpdated().getTime() > newestTime) {
        newestTime = file.getLastUpdated().getTime();
        newestFile = file;
      }
    }

    if (!newestFile) {
      showDialog('No wave file found. Upload a wave_*.csv to your wave folder.');
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

    showDialog('Imported ' + newestFile.getName() + '\nUpdated ' + updated + ' existing, added ' + added + ' new, skipped ' + skipped + '.');

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
