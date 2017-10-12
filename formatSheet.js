// fifth thing to run
// only run on what TAs will see

/**
* This function starts the process for formatting a sheet depending on
* the values in each cell.
* 1 is green, 0 is red, between 0 and 0.2 is orange, between 0.2 and 0.5
*   is yellow, between 0.5 and 0.7 is olive.
* Note: You must update the spreadsheetId and sheetName appropriately.
*/
function start() {
  // change these variables according to specific IDs
  var spreadsheetId = "1tx6Xk2ce9S2q95ZwQ5id0t78ZN_8ToCp4iRxeAPiq4U";
  var sheetName = "List & Map";
  // end here
  
  var sheet = getSpreadsheet(spreadsheetId, sheetName);
  sheet.clearFormats();
  formatSheet(sheet);
}

/**
* This method uses a Google spreadsheet's ID to get the sheet itself.
* @param id, the id of the spreadsheet you wish to retrieve
* @return sheet, the spreadsheet you wanted
*/
function getSpreadsheet(id, sheetName) {
  var ss = SpreadsheetApp.openById(id);
  var sheet = ss.getSheetByName(sheetName);
  return sheet;
}

/**
* This method takes in a sheet and formats all of its cells according
* to its values.
* 1 is green, 0 is red, between 0 and 0.2 is orange, between 0.2 and 0.5
*   is yellow, between 0.5 and 0.7 is olive.
*/
function formatSheet(sheet) {
  sheet.setFrozenColumns(1);
  sheet.setFrozenRows(1);
  var range = sheet.getDataRange();
  var data = range.getValues();
  for (var i = 0; i < data.length; ++i) {
    for (var j = 0; j < data[i].length; ++j) {
      var value = data[i][j];
      if (i === 0 || j === 0) {
        sheet.getRange(i + 1, j + 1).setFontWeight('bold');
      }
      if (value === 0) {
        sheet.getRange(i + 1, j + 1).setBackground('teal');
      } else if (value === 1) {
        sheet.getRange(i + 1, j + 1).setBackground('green');
      } else if (value <= 0.2 && value > 0) {
        sheet.getRange(i + 1, j + 1).setBackground('red');
      } else if (value <= 0.5 && value > 0.2) {
        sheet.getRange(i + 1, j + 1).setBackground('orange');
      } else if (value <= 0.7 && value > 0.5) {
        sheet.getRange(i + 1, j + 1).setBackground('yellow');
      } else if (value < 1 && value > 0.7) {
        sheet.getRange(i + 1, j + 1).setBackground('lime');
      }
    }
  }
}