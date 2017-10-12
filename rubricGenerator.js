// second thing to run

/**
* This method simply calls on makeRubricFromWiki
* Note: Make sure to change the url and assignmentName variables as necessary!
*/
function start() {
  // change these variables according to specific url and assignment
  var url = 'https://classes.engineering.wustl.edu/cse231/core/index.php?title=SimpleList_and_SimpleMap_Assignment';
  var assignmentName = 'List & Map';
  // end here
  
  makeRubricFromWiki(url, assignmentName);
}

/**
* This method will parse through a wiki page and convert the wiki's rubric into
* one on Google Docs. This rubric can then be used by other scripts to generate
* a rubric spreadsheet for TAs, which will then be emailed out to students every
* week as a way to update them about their progress in the course.
* Note: this method assumes that there are no doubly indented bullet points within
*   the rubric and that everything is enclosed under one <ul> block. The generated
*   Google Doc will end up in the user's root directory and must be manually moved
*   later on.
* @param url, the url of the relevant wiki page
* @param docName, the name of the assignment and the name of the Google Doc that
*   will be created
*/
function makeRubricFromWiki(url, docName) {
  var rubricDoc = DocumentApp.create(docName);
  var docBody = rubricDoc.getBody();
  
  var response = UrlFetchApp.fetch(url);
  var text = response.getContentText();
  var position = text.search('id="Rubric"');
  text = text.substring(position, text.length);
  position = text.search('<li>');
  var endPosition = text.search('</ul>');
  text = text.substring(position, endPosition);
  while (text.search('<li>') == 0) {
    var end = text.search('</li>');
    var bulletPoint = docName + ": ";
    bulletPoint += text.substring(4, end);
    docBody.appendListItem(bulletPoint);
    text = text.substring(2, text.length);
    position = text.search('<li>');
    text = text.substring(position, text.length);
  }
}