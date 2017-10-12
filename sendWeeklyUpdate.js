// sixth thing to run

/**
* This function calls every method necessary to compose and send the weekly update to
* every student in the course. It will compose this email using a master spreadsheet
* which contains relevant feedback on Q&S forms, studios, and assignments.
* Note: You must update spreadsheetId and sheetName appropriately.
* Important note: the function assumes that the feedback starts at column 3, with the
*   first column representing the student's student ID number and the second column
*   representing their email.
*/
function start() {
  // change these variables according to specific IDs
  var spreadsheetId = '1tx6Xk2ce9S2q95ZwQ5id0t78ZN_8ToCp4iRxeAPiq4U';
  var sheetName = 'Threads & Executors';
  // end here
  
  var sheet = getSpreadsheet(spreadsheetId, sheetName);
  var lastRow = sheet.getLastRow();
  for (var i = 2; i <= lastRow; ++i) {
    sendEmail(sheet.getRange(i, 1).getValue(), sheet);
  }
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
* This method takes in a student ID number and a Google spreadsheet and uses it to
* compose/send an email updating the student about their weekly progress in the course.
* Important note: the function assumes that the feedback starts at column 3, with the
*   first column representing the student's student ID number and the second column
*   representing their email.
* @param studentId, the student ID of the student you are sending mail to
* @param sheet, the spreadsheet containing student feedback
*/
function sendEmail(studentId, sheet) {
  var row = getRow(studentId, sheet);
  var lastColumn = sheet.getLastColumn();
  var recipient = sheet.getRange(row, 2).getValue();
  var feedback = getFeedback(row, lastColumn, sheet);
  var subject = 'Your Weekly Update in CSE 231S';
  var body = 'Student ID: ' + studentId + "\n\n";
  body += 'If this is not your Student ID number, let an instructor know right away.' + "\n\n";
  body += '1 means completed or full credit, 0 means incomplete or no credit.' + "\n";
  body += '0.5 means partial credit, minor fixes needed.' + "\n";
  body += 'This email is meant to update you about your progress in the course and does not reflect your actual grade. Reach out to an instructor for clarification.' + "\n";
  body += 'Please do not reply to this email, post on Piazza if you have any questions.' + "\n\n";
  for (var i = 0; i < feedback.length; ++i) {
    var colName = sheet.getRange(1, i + 3).getValue();
    var colBody = feedback[i];
    body += colName + ': ' + colBody + "\n";
  }
  MailApp.sendEmail(recipient, subject, body);
}

/**
* This method creates an array containing all of the feedback we have for students.
* Important note: the function assumes that the feedback starts at column 3, with the
*   first column representing the student's student ID number and the second column
*   representing their email.
* @param row, the row of the student you are sending the update to
* @param lastColumn, the lastColumn with data in it
* @param sheet, the spreadsheet to parse through for feedback
* @return feedback, the array containing all of the feedback for the given student.
*/
function getFeedback(row, lastColumn, sheet) {
  var feedback = [];
  for (var i = 3; i <= lastColumn; ++i) {
    feedback.push(sheet.getRange(row, i).getValue());
  }
  return feedback;
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
  return null;
}