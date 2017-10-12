// third thing to run

/**
* This function calls every method necessary to examine the roster sheet and create
* a new sheet for the week which contains a rubric for the student's progress in the
* course. The sheet will be autofilled with every student's student ID number, email,
* and Q&S completion grades.
* Note: You must update spreadsheetId, rosterSheetName, newSheetName, rubricDocId,
*   mondayFormId, wednesdayFormId, and formDueDate appropriately. When changing the
*   dates in formDueDates, keep in mind the month (and month only) is indexed at 0.
*   So, June is NOT 6, it is 5. July is 6, August is 7, etc.
* Note: If you choose to add quiz questions to Q&S forms, you must first make it a quiz
*   rather than a form, assign point values to questions, and assign feedback to questions
*   that are actual quiz questions. Without feedback, the script will not treat the quiz
*   question as a quiz question.
*/
function start() {
  // change these variables according to specific IDs
  var spreadsheetId = '1tx6Xk2ce9S2q95ZwQ5id0t78ZN_8ToCp4iRxeAPiq4U';
  var rosterSheetName = 'Roster';
  var newSheetName = 'Threads & Executors';
  var rubricDocId = '1p-Vb1y0yeHPDEPJ08-LEexrVuQDHMaM1lFOpsTF5bq4';
  var mondayFormId = '1igo-itQq7e454-ErQcDhuC940wYpAbeGvomfg-kEAoM';
  var wednesdayFormId = '1rgFeXBq-HKMmDux-F05uTzlZ963pGROhA26PTqq-DSk';
  var formDueDates = [new Date(2017, 8, 25, 16), new Date(2017, 8, 27, 16)];
  // end here
  
  var ss = getSpreadsheet(spreadsheetId);
  var rosterSheet = ss.getSheetByName(rosterSheetName);
  createSheet(ss, rosterSheet, newSheetName, rubricDocId, mondayFormId, wednesdayFormId, formDueDates);
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
* This method does all of the work in creating the new sheet within the spreadsheet.
* It uses information from the rosterSheet, rubric doc, and Q&S forms to create a
* spreadsheet with autofilled information including the student's ID number, email,
* and Q&S completion grades.
* @param ss, the spreadsheet which will contain the new sheet
* @param rosterSheet, the specific sheet which contains the class roster
* @param week, the name of the new sheet which will contain the week's rubric
* @param rubricId, the id of the Google Doc which outlines the rubric
* @param monday, the form id of the Monday Q&S form
* @param wednesday, the form id of the Wednesday Q&S form
* @param formDueDates, an array containing the due dates for the two Q&S forms
*/
function createSheet(ss, rosterSheet, week, rubricId, monday, wednesday, formDueDates) {
  ss.insertSheet(week);
  var newSheet = ss.getSheetByName(week);
  newSheet.appendRow(['Student ID', 'Email', 'Comments (none means everything is all good)', 'Q&S Form Monday', 'Q&S Form Wednesday'].concat(createRubric(rubricId)));
  var lastRow = rosterSheet.getLastRow();
  for (var i = 2; i <= lastRow; ++i) {
    var studentId = rosterSheet.getRange(i, 3).getValue();
    var email = rosterSheet.getRange(i, 5).getValue();
    newSheet.appendRow([studentId, email, ''].concat(qAndS(email, monday, wednesday, formDueDates)));
  }
}

/**
* This method takes in a Google Doc id and returns all of the listed bullet points within
* the Google Doc as an array. These bullet points are meant to represent the rubric of the
* given assignment. The bullet points within the doc should be as detailed as possible, as
* they will become the headers of the spreadsheet and later used in the emails updates
* pushed out to students every week.
* @param id, the id of the rubric Google Doc
*/
function createRubric(id) {
  var doc = DocumentApp.openById(id);
  var listItems = doc.getBody().getListItems();
  var rubric = [];
  for (var i in listItems) {
    rubric.push(listItems[i].getText());
  }
  return rubric;
}

/**
* This method takes in a student ID number and the IDs of the Monday and
* Wednesday Q&S forms. It returns an array of size 2 containing 0s, 1s, or 0.7s
* depending on whether the student completed the relevant forms.
* @param studentId, the ID of the student you wish to check
* @param monday, the form ID of the Monday Q&S form
* @param wednesday, the form ID of the Wednesday Q&S form
* @param formDueDates, an array containing the due dates for the two Q&S forms
* @return formsDone, an array of size 2 containing 1 if the student was on time
*  and got all quiz questions, 0.7 if finished late and got all quiz questions,
*   0.9 if on time but got quiz questions wrong, 0.63 if late and got quiz
*   questions wrong, and 0 otherwise
*/
function qAndS(email, monday, wednesday, formDueDates) {
  // edit to calculate timestamp
  // edit to calculate multiple choice grade
  formsDone = [];
  formsDone.push(checkForm(email, monday, formDueDates[0]));
  formsDone.push(checkForm(email, wednesday, formDueDates[1]));
  return formsDone;
}

/**
* This method checks all of the responses associated with a form to determine
* if a specific student filled out a given form.
* @param studentId, the ID of the student you wish to check
* @param formId, the ID of the form you wish the check
* @param dueDate, the due date for the given form
* @return score, 1 if the student was on time and got all quiz questions,
*   0.7 if finished late and got all quiz questions, 0.9 if on time but got quiz
*   questions wrong, 0.63 if late and got quiz questions wrong, and 0 otherwise
*/
function checkForm(email, formId, dueDate) {
  Logger.log(formId);
  var form = FormApp.openById(formId);
  var responses = form.getResponses();
  var score = 0;
  for (var i in responses) {
    var response = responses[i];
    var itemResponses = response.getItemResponses();
    var formEmail = itemResponses[1].getResponse();
    if (formEmail === email) {
      score = checkSubmitTime(response, dueDate) * checkGrade(response);
    }
  }
  return score;
}

/**
* This method checks the submit time of the form and applies a penalty if the
* form was submitted late. If the student was late but got it in within a week
* of the deadline, they get 0.7 of the credit.
* @param response, the form response attached to the student in question
* @param dueDate, the date the specific form was due
* @return 1 if the form was submitted on time, 0.7 if it was late but within a week
*   of the deadline, and 0 otherwise
*/
function checkSubmitTime(response, dueDate) {
  var timestamp = response.getTimestamp();
  if (timestamp.getTime() <= dueDate.getTime()) {
    return 1;
  } else if (timestamp.getTime() - dueDate.getTime() <= 604800000) {
    return 0.7;
  } else {
    return 0;
  }
}

/**
* This method checks any quiz questions that might be associated with the form for
* correctness. This method makes many assumptions due to the fault mentioned in
* the note. Every valid quiz question should be assigned a point value of 1 and
* it should include feedback. If the created form does not meet these conditions,
* this method will not behave as expected.
* Note: This method is imperfect due to faults in the getGradableItemResponses()
*   method. The method should not get item responses that do not have assigned
*   point values, but does so anyway. When Google fixes this, so should we.
* @param response, the form response attached to the student in question
* @return 1 if there were no quiz questions or if every answer was correct, 0.9 if
*   the answer was incorrect
*/
function checkGrade(response) {
  var gradables = response.getGradableItemResponses();
  var totalScore = 0;
  var possibleScore = 0;
  for (var i in gradables) {
    var gradable = gradables[i];
    if (gradable.getFeedback() != null) {
      totalScore += gradable.getScore();
      possibleScore++;
    }
  }
  if (possibleScore == 0) {
    return 1;
  } else if (totalScore / possibleScore < 1) {
    return 0.9;
  } else {
    return 1;
  }
}