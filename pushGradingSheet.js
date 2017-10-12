// fourth thing to run

/**
* This function calls every method necessary to examine the TA roster sheet and create
* a new sheet in the assignment spreadsheet for each TA, with the sheet containing the
* test result for every student the TA is in charge of.
* Note: You must update taSpreadsheetId and assignmentTestsId appropriately.
* Note: This script assumes that the identifying information (whether student ID or
*   WUSTL key) for students is the same in both spreadsheets. If it is not, this script
*   will not behave as expected.
*/
function start() {
  // change these variables according to specific IDs
  var taSpreadsheetId = "1miHqnFRG-SSkdQ4HR8zokjSFzdnsWC4FsVJKLzjXtIA";
  var assignmentTestsId = "1KhCrG1w6hH6_PukTHenGNwwSsyXKmh2KXCoLWgW45YA";
  // end here
  
  var taSheet = getSpreadsheet(taSpreadsheetId).getSheets()[0];
  var assignmentTestsSS = getSpreadsheet(assignmentTestsId);
  var allTAs = getStudentsForTAs(taSheet);
  for (var i in allTAs) {
    makeSheetForTA(allTAs[i], assignmentTestsSS);
  }
}

/**
* This method uses a Google spreadsheet's ID to get the sheet itself.
* @param id, the id of the spreadsheet you wish to retrieve
* @return ss, the spreadsheet you wanted
*/
function getSpreadsheet(id) {
  var ss = SpreadsheetApp.openById(id);
  return ss;
}

/**
* This method makes an array of arrays, which each inner array containing the
* TA at the head and his/her students in every subsequent spot.
* @param taSheet, the sheet that contains the TA roster
* @return allTAs, an array of arrays containing each TA and his/her students
*/
function getStudentsForTAs(taSheet) {
  var allTAs = [];
  
  var range = taSheet.getDataRange();
  var data = range.getValues();
  for (var i = 1; i < data.length; ++i) {
    var thisTA = [];
    for (var j in data[i]) {
      if (data[i][j] != null) {
        thisTA.push(data[i][j]);
      }
    }
    allTAs.push(thisTA);
  }
  return allTAs;
}

/**
* This method creates a sheet in the assignment spreadsheet for each TA, with the sheet
* containing the Eclipse test results for each student the TA is in charge of.
* Note: This script assumes that the identifying information (whether student ID or
*   WUSTL key) for students is the same in both spreadsheets. If it is not, this script
*   will not behave as expected.
* @param thisTA, an array containing the TA in question at the head and his/her students
*   following
* @param assignmentTestsSS, the spreadsheet associated with the given assignment
*/
function makeSheetForTA(thisTA, assignmentTestsSS) {
  var gradingSheet = assignmentTestsSS.getSheetByName("Sheet1");
  var thisTaSheet = assignmentTestsSS.insertSheet(thisTA[0]);
  var title = gradingSheet.getDataRange().getValues()[0];
  thisTaSheet.appendRow(title);
  for (var i = 1; i < thisTA.length; ++i) {
    var student = thisTA[i];
    Logger.log(student);
    var studentRow = getRow(student, gradingSheet);
    Logger.log(studentRow);
    Logger.log(gradingSheet.getDataRange().getValues()[studentRow - 1]);
    var range = gradingSheet.getRange(studentRow, 1, 1, gradingSheet.getDataRange().getValues()[studentRow - 1].length);
    var data = range.getValues()[0];
    thisTaSheet.appendRow(data);
  }
}

/**
* This method takes in a studentId and a spreadsheet to determine which row to edit
* on the spreadsheet. If the person already exists on the spreadsheet, the row
* of the current entry will be returned to be modified. If the person does not
* exist, the next free row will be returned.
* @param studentId, the studentId of the student you want to search for
* @param sheet, the roster sheet you wish to search
* @return row, the row at which the student's information should be added
*/
function getRow(studentId, sheet) {
  var range = sheet.getDataRange();
  var data = range.getValues();
  for (var i in data) {
    for (var j in data[i]) {
      if (data[i][j] === studentId) {
        return parseInt(i) + 1;
      }
    }
  }
  var numRows = data.length;
  return numRows + 1;
}