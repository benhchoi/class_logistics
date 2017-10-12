// first thing to run

/**
* This function starts the whole process of updating the roster. It will
* get the relevant form with student information, update the excel sheet
* with the newest roster, and then add any new responses at the bottom of
* the excel sheet.
* Note: You must update the rosterFormId, spreadsheetId, and sheetName of
*   the roster appropriately.
*/
function start() {
  // change these variables according to specific IDs
  var rosterFormId = '1YjQrvvNyvpHmLYWMl3FC8cLbtstR4SBqnLl48FdEodQ';
  var spreadsheetId = '1Kp7emgDOVZ6ay0bnyasDCBpb8SqstwEy5HqjA10BEaU';
  var sheetName = 'Roster';
  // end here
  
  var form = getForm(rosterFormId);
  var sheet = getSpreadsheet(spreadsheetId, sheetName);
  sheet.clear();
  var students = getStudents(form);
  updateRoster(students, sheet);
}

/**
* This method takes in an array of students and a spreadsheet. It checks
* the studentId of all students then edits data in the spreadsheet if the
* studentId already exists. If not, it will add the data to the next available
* row of the spreadsheet.
* @param students, an array of arrays that contains student data
* @param sheet, the sheet that will be modified
*/
function updateRoster(students, sheet) {
  var title = ["First Name", "Last Name", "Student ID", "WUSTL Key", "Email"];
  sheet.appendRow(title);
  for (var i in students) {
    var studentId = parseInt(students[i][2]);
    var row = getRow(studentId, sheet);
    for (var j = 1; j <= 5; ++j) {
      sheet.getRange(row, j).setValue(students[i][j - 1]);
    }
  }
}

/**
* This method takes in a form and uses that form to extract all of the responses
* and format the data into an array of students, each student represented by an
* array of data containing information like name, email, and student ID.
* @param form, the form which we will extract data from
* @return students, the array of arrays filled with student information
*/
function getStudents(form) {
  var responses = form.getResponses();
  var students = [];
  for (var i in responses) {
    var response = responses[i];
    var itemResponses = response.getItemResponses();
    var student = [];
    for (var j in itemResponses) {
      student.push(itemResponses[j].getResponse());
    }
    students.push(student);
  }
  return students;
}

/**
* This method uses a Google form's ID to get the form itself.
* @param id, the id of the form you wish to retrieve
* @return form, the google form you wanted
*/
function getForm(id) {
  var form = FormApp.openById(id);
  return form;
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