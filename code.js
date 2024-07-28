const FIREBASE_URL = FirebaseInfo.getFIREBASE_URL(); // or Firestore URL
const FIREBASE_SECRET = FirebaseInfo.getFIREBASE_SECRET(); // or API key if using Firestore
const email = Session.getActiveUser().getEmail(); // user email

//Layout Design
var spacing = CardService.newTextParagraph().setText(' ');
var spacer = CardService.newCardSection()
  .addWidget(CardService.newDecoratedText()
    .setText(' ')
    .setBottomLabel(' '));


// Add card action for Help
var helpAction = CardService.newAction().setFunctionName('onHelpAction');
var cardHelpAction = CardService.newCardAction().setText('Help').setOnClickAction(helpAction);


/**
 * Help Action Function
 */
function onHelpAction(e) {
  // Check if the 'welcome' parameter is set
  var welcome = e && e.parameters && e.parameters.welcome === 'true';

  // If is for welcome page, button is start instead of done
  var buttonText = welcome ? "Start" : "Done";

  const card = CardService.newCardBuilder()
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextParagraph().setText(`<b>Welcome to</b> <font color=\"#ffaf51\"><b>Quack-a-Tag!🏷️</b></font> <br> Add your first tag in Your Library 📖 to get started, or auto generate tags for your selected file(s) under Manage File(s) ⚙️. <br> <br> 📖 > <font color=\"#5B7F98\"><b>(Edit...✏️)</b></font> <br> Rename or delete existing tags. <br> <br> 📖 > <font color=\"#A1896B\"><b>(File Search 🔎)</b></font> <br> Search for files by selecting the tags that you assigned/described. <br> <br> *Note: You <b>don’t</b> need to select every tag associated with a file for it to appear. <br> <br> <br> ⚙️ > <font color=\"#5B7F98\"><b>(Edit...✏️)</b></font> <br> Delete tags previously added to the selected file(s) <br> <br> ⚙️ > <font color=\"#7A4DB2\"><b>(Auto Tag ✨)</b></font> <br> Auto generates tags based on what can be described from your file. Depending on your file size, it may take a few seconds to generate. <br> <br> *E.g. Tags from an invoice's contents <font color=\"#FF8686\">[recipient's gmail], [recipient's contact], [recipient's name], [service/product purchased]</b></font>. <br> <br> Click <font color=\"#ffaf51\"><b>(${buttonText})</b></font> to get started on your hassle-free organizing journey! You can always revisit this guide under <b>⋮</b> > Help <br> <br> Thanks for using our service!`)))
    .addSection(CardService.newCardSection()
      .addWidget(CardService.newTextButton()
        .setText(buttonText)
        .setOnClickAction(welcome
          ? CardService.newAction().setFunctionName('onLibraryPage').setParameters({update: 'true'})
          : CardService.newAction().setFunctionName('goPrevPage'))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
        .setBackgroundColor('#ffaf51')) // Background color for filled style
    );



  return card.build();
}



/**
 * The function to run when the add-on is installed.
 */
function onInstall(e) {
  onHomepage(e);
}



/**
 * The function to run when the homepage is opened.
 */
function onHomepage() {
  // If no tags added to library before, show welcome page
    if(getAllTagsName().length>0){
      return onLibraryPage ();
    } else {
      return onHelpAction({parameters: {welcome: 'true'}});
    }
}

/**
 * The function to run when the library page is opened.
 */
function onLibraryPage(e, isEditMode = false){

  var libraryPage = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Your Library 📖"))
    var headerSet = CardService.newButtonSet()
      .addButton(CardService.newTextButton()
        .setText(isEditMode? "Done ✅":'Edit...✏️') //If is edit mode, it change to done
        .setOnClickAction(CardService.newAction().setFunctionName('changeEditModeLibrary').setParameters({ isEditMode:isEditMode.toString() }))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
        .setBackgroundColor('#5B7F98')) // Background color for filled style
      .addButton(CardService.newTextButton()
        .setText('File Search 🔎')
        .setOnClickAction(CardService.newAction().setFunctionName('onSearchPage'))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor('#A1896B')) // Set desired background color


    // Add New Tags text field
    var textInput = CardService.newTextInput()
      .setFieldName('new_tag')
      .setTitle("Add New Tag ➕")
      .setHint(' "E.g. Outstanding, Report, Follow-up..." ')

    // Add Widgets to Header
    var libraryHeader = (CardService.newCardSection()
      .addWidget(headerSet))
      .addWidget(spacing)
      .addWidget(spacing)
      .addWidget(textInput)
      // Add Tag Button
      .addWidget(CardService.newTextButton()
        .setText('Confirm')
        .setOnClickAction(CardService.newAction().setFunctionName('addTagToDb'))
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setBackgroundColor('#ffaf51')) // Custom color for the button
      .addWidget(spacing);


    // Add Tags Display Title as section
    var libraryTagsTitle = CardService.newCardSection()
      .addWidget(CardService.newTextParagraph()
        .setText('Tags 🏷️'));

    // Display the tag list
    var tagList;
    var allTags = getAllTagsName();
    if (allTags.length>0){
      tagList = CardService.newButtonSet();
      allTags.forEach(function(tag) {
        tagList.addButton(CardService.newTextButton()
            .setText(tag)
            .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
            .setBackgroundColor('#8A4B3C') // Background color for filled style
            .setOnClickAction(CardService.newAction().setFunctionName('nothing')));
      })
    }
    // Show message if no tags
    else {
      tagList = CardService.newTextParagraph().setText('Add your first tag!');
    }

    // Add Tags Display's section
    var libraryTagsContent = CardService.newCardSection();

    // Create rename and remove button if is in edit mode
    if (isEditMode){
      var editButtons = CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText("Rename ✍🏼")
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) 
          .setBackgroundColor('#e6a902') 
          .setOnClickAction(CardService.newAction().setFunctionName('renameTagLibraryPage')))
        .addButton(CardService.newTextButton()
          .setText("Remove ❌")
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) 
          .setBackgroundColor('#F68888') 
          .setOnClickAction(CardService.newAction().setFunctionName('removeTagLibraryPage')));

        libraryTagsContent.addWidget(editButtons).addWidget(spacing).addWidget(spacing);
    }

    libraryTagsContent.addWidget(tagList);

    // Add above sections to home page
    libraryPage.addSection(libraryHeader);
    // libraryPage.addSection(spacer);
    libraryPage.addCardAction(cardHelpAction);
    libraryPage.addSection(libraryTagsTitle);
    libraryPage.addSection(libraryTagsContent);

  // If from Welcome/Help page, update the page, instead create
    if (e && e.parameters && e.parameters.update ) {
      return  CardService.newNavigation().updateCard(libraryPage.build())
    }
    return libraryPage.build();
}


/**
 * The function is to add the new tag into library/collection
 */
function addTagToDb(e) {
  // return error message if new tag name is not enter
  if (!e.formInputs.new_tag){
    return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
            .setText('Please enter the tag name.'))
          .build();
  }

  var newTag = e.formInput.new_tag.trim();
  var add = addTagIfNotExists(newTag); // return true if the tag has successfully added

  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(add? newTag + " has been added to Your Library." : newTag + " already exists in Your Library"))
      .setNavigation(CardService.newNavigation().updateCard(onLibraryPage())) 
      .build();

}

/**
 * The function is to display remove tag page
 */
function removeTagLibraryPage(){
  var removeTagLibraryPage = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Remove Tag From Library 📖"))

  // Cancel and Remove buttons
  var actionBtns = CardService.newButtonSet()
        .addButton(CardService.newTextButton()
          .setText("Cancel ❌")
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) 
          .setBackgroundColor('#f0831d') 
          .setOnClickAction(CardService.newAction().setFunctionName('onLibraryPage').setParameters({update: 'true'})))
        .addButton(CardService.newTextButton()
          .setText("Remove ❌")
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) 
          .setBackgroundColor('#F68888') 
          .setOnClickAction(CardService.newAction().setFunctionName('removeTag')));
  
  // Tag Title
  var libraryTagsTitle = CardService.newTextParagraph().setText('Tags 🏷️')

  // Checkbox to select remove
  var tagData = getAllTagsData ();
  Logger.log(tagData)
  var tagList = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setFieldName('tagsToRemove');
      
  if (tagData) {
    tagData.forEach(function(tag) {
      tagList.addItem(tag.name, JSON.stringify({ id: tag.id, name: tag.name }), false);
    });
  }

  // Add into Section
  var actionBtnsSection = CardService.newCardSection()
    .addWidget(actionBtns);

  var tagSection = CardService.newCardSection()
    .addWidget(libraryTagsTitle)
    .addWidget(tagList);
     
  // Display all section
  removeTagLibraryPage.addSection(actionBtnsSection).addSection(tagSection);

  return CardService.newNavigation().updateCard(removeTagLibraryPage.build());

}

/**
 * Function to remove tag from Tags db and FileTag db
 */
function removeTag (e){
  // Check if any tags are selected for removal
  if (!e.formInputs.tagsToRemove) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Please select at least tag to remove.'))
      .build();
  }

  // Extract id and name
  var tagsId = e.formInputs.tagsToRemove.map(tag => JSON.parse(tag).id);
  var tagsName = e.formInputs.tagsToRemove.map(tag => JSON.parse(tag).name);


  // Remove tags from the Tag database
  tagsId.forEach(id =>{
    removeTagFromTagDB(id);
  });


// Remove tags for every files
  removeTagsFromUserFiles(tagsId);


  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification()
      .setText(`${tagsName.join(', ')} have been removed.`))
    .setNavigation(CardService.newNavigation().updateCard(onLibraryPage())) 
    .build();
}

/**
 * Function to remove tag from the Tag database
 */
function removeTagFromTagDB(tagId) {
  const url = `${FIREBASE_URL}/tags/${tagId}.json?auth=${FIREBASE_SECRET}`;
  
  try {
    const options = {
      method: 'DELETE'
    };
    UrlFetchApp.fetch(url, options);
    return true; //indicate success

  } catch (e) {
    Logger.log('Error removing tag: ' + e.toString());
    return false; //indicate failure
  }
}

/**
 * Function to remove tags from all the user's files
 * @param - list of tag id
 */
function removeTagsFromUserFiles(tagsId) {
  const url = `${FIREBASE_URL}/fileTags.json?auth=${FIREBASE_SECRET}`;
  
  try {
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      contentType: 'application/json'
    });
    
    const fileTagsData = JSON.parse(response.getContentText());
    const userFileTags = Object.entries(fileTagsData).filter(([key, value]) => value.gmail === email);

    userFileTags.forEach(([key, fileData]) => {
      const updatedTags = fileData.tags.filter(tagId => !tagsId.includes(tagId));

      
      // Check if updatedTags is empty, if so, delete the document
      if (updatedTags.length === 0) {
        var deleteUrl = `${FIREBASE_URL}/fileTags/${key}.json?auth=${FIREBASE_SECRET}`;
        var deleteOptions = {
          method: 'DELETE'
        };

        UrlFetchApp.fetch(deleteUrl, deleteOptions);
      } 
      // Update the database with the new list of tags
      else{
        var updatedData = {
              fileid: hash(fileId),
              gmail: email,
              tags: updatedTags
            };

            var url = `${FIREBASE_URL}/fileTags/${key}.json?auth=${FIREBASE_SECRET}`;
            var options = {
              method: 'PUT',
              contentType: 'application/json',
              payload: JSON.stringify(updatedData)
            };

            UrlFetchApp.fetch(url, options);
      }

    });
    
  } catch (e) {
    Logger.log('Error removing tags from files: ' + e.toString());
  }
}

function renameTagLibraryPage(){

}

/**
 * This is a back fucntion, allow user to go back to prev page
 */
function goPrevPage() {
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().popCard())
    .build();
}


/**
 * File Search Page
 */
function onSearchPage() {
  var searchPage = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("File Search 🔎"));
    
  // Add File Search for tags field
  var fileSearchInput = CardService.newTextInput()
    .setFieldName('file_search')
    .setTitle("Insert tags to search for files 🏷️")
    .setHint(' "E.g. PDF, Budget, Sales..." ');
  
  // Set suggestions only if there are tags in library
  var allTags = getAllTagsName();
  if (allTags.length>0){
    fileSearchInput.setSuggestions(suggestTags(allTags))
  }

  // Add New Tag's section
  var mainSection = CardService.newCardSection()
    .addWidget(spacing)
    .addWidget(fileSearchInput)
    .addWidget(CardService.newTextButton()
      .setText('Confirm')
      .setOnClickAction(CardService.newAction().setFunctionName('ConfirmSearch'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor('#ffaf51')); // Custom color for the button
  
  // Add above sections to search page
  searchPage.addSection(mainSection);
  searchPage.addCardAction(cardHelpAction);

  return searchPage.build();
}





/**
 * The function to display Manage Page.
 */
function onManagePage(selectedItems, isEditMode=false) {
  var managePage = CardService.newCardBuilder().setHeader(CardService.newCardHeader().setTitle("Manage File(s) ⚙️"));
      managePage.addCardAction(cardHelpAction);
    
  if (selectedItems.length == 1) {
    var sections = manageSelectOne(selectedItems,isEditMode);
  } else {
    var sections = manageSelectMultiple(selectedItems,isEditMode);
  }

  sections.forEach(function(section) {
      managePage.addSection(section);
    });

  return managePage.build();
}

/**
 * The function to display managepage when only 1 file is selected.
 */
function manageSelectOne(selectedItems, isEditMode){
  var file = selectedItems[0];

  // Edit and Auto Tag Buttons
  var actionButtonSet = CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText(isEditMode ? 'Done ✅' : "Edit...✏️") //show done button if is in edit mode (after click edit button),else show edit button
      .setOnClickAction(CardService.newAction()
        .setFunctionName('changeEditModeFile')
        .setParameters({ selectedItems: JSON.stringify(selectedItems),isEditMode:isEditMode.toString() }))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
      .setBackgroundColor('#5B7F98')) // Background color for filled style

  // Display auto tag if is in edit mode, else remove button
  if (!isEditMode){
    actionButtonSet.addButton(CardService.newTextButton()
      .setText("Auto Tag ✨")
      .setOnClickAction(CardService.newAction().setFunctionName('autoTagOne'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) 
      .setBackgroundColor(isEditMode ? '#F68888' :'#635A7A')); 
  } else{
    actionButtonSet.addButton(CardService.newTextButton()
      .setText('Remove ❌')
      .setOnClickAction(CardService.newAction()
        .setFunctionName('removeFileTag')
        .setParameters({selectedItems: JSON.stringify(selectedItems), fileId : file.id}))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
      .setBackgroundColor('#F68888')); 
  }
    

  // Display Image
  var imagelink = file.iconUrl;
  var imageWidget = CardService.newImage()
    .setImageUrl(imagelink)
    .setAltText(file.title);

  
  // Display File Details
  var fileDetails = CardService.newGrid()
    .setNumColumns(1)
    .addItem(CardService.newGridItem()
        .setTitle(file.title) //file name
        .setSubtitle(getSimplifiedMimeType(file.mimeType)) //file type
        .setTextAlignment(CardService.HorizontalAlignment.CENTER));

  // Add Tag Input
  var addTagInput = CardService.newTextInput()
    .setFieldName('addNewTagOneFileInput')
    .setTitle("Add Tag to File ➕")
    .setHint(' "E.g. Outstanding, Report, Follow-up..." ')
  

  // Set suggestions only if there are tags in library
  var allTags = getAllTagsName();
  if (allTags.length>0){
    addTagInput.setSuggestions(suggestTags(allTags))
  }


  // Add Tag Button
  var addTagButton = CardService.newTextButton()
    .setText('Confirm')
    .setOnClickAction(CardService.newAction()
      .setFunctionName('addNewTagFile')
      .setParameters({ selectedItems: JSON.stringify(selectedItems) }))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
      .setBackgroundColor('#ffaf51'); // Background color for filled style


  // Display Tags 
  var tagsTitle = CardService.newTextParagraph()
    .setText('Tags 🏷️');


  // Create buttons for each tag
  var tagData = getFileTagsDataById (file.id) // Read Database
  Logger.log(JSON.stringify(tagData))

  // If is not edit mode, display tag list as button, else display tag list as checkbox
  var tagList;
  var empty = true; // to check whether there is tag to display or display empty message

  if (!isEditMode) {
    tagList = CardService.newButtonSet();
    if (tagData && tagData.tags) {
      var sortedTags = getSortedTags(tagData.tags);
      sortedTags.forEach(function(tag) {
        empty = false;
        tagList.addButton(CardService.newTextButton()
          .setText(tag.name)
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
          .setBackgroundColor('#8A4B3C') // Background color for filled style
          .setOnClickAction(CardService.newAction().setFunctionName('nothing')));
      });
    }
  } else {
    tagList = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setFieldName('tagsToDelete');
    if (tagData && tagData.tags) {
      var sortedTags = getSortedTags(tagData.tags);
      sortedTags.forEach(function(tag) {
        empty = false;
        tagList.addItem(tag.name, JSON.stringify({ id: tag.id, name: tag.name }), false);
      });
    }
  }

  // Display Message when the tags for the file is empty 
  var emptyTag = CardService.newTextParagraph().setText('This file has no tags. Add them in the text input above and confirm your selection.');



  // Manage One Display
  var headerManage = CardService.newCardSection()
    .addWidget(actionButtonSet)
    .addWidget(spacing)
    .addWidget(spacing)
    .addWidget(imageWidget)
    .addWidget(fileDetails);


  var addTagSection = CardService.newCardSection()
    .addWidget(addTagInput)
    .addWidget(addTagButton)
    .addWidget(spacing);


  var tagManageTitle = CardService.newCardSection()
    .addWidget (spacing)
    .addWidget (spacing)
    .addWidget(tagsTitle)
    .addWidget (spacing);
  

  if (!empty){
    tagManageTitle.addWidget(tagList);
  }
  else {

    tagManageTitle.addWidget(emptyTag);
  }
    


  // Return the sections as an array
  return [headerManage, addTagSection, tagManageTitle, spacer];
}


/**
 * The function to display managepage when multiple files are selected.
 */
function manageSelectMultiple(selectedItems){

  // Create the button
  var actionButtonSet = CardService.newButtonSet()
    .addButton(CardService.newTextButton()
      .setText("Edit...✏️")
      .setOnClickAction(CardService.newAction().setFunctionName('editTagMutliple'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
      .setBackgroundColor('#5B7F98')) // Background color for filled style
    .addButton(CardService.newTextButton()
      .setText("Auto Tag ✨")
      .setOnClickAction(CardService.newAction().setFunctionName('autoTagMultiple'))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
      .setBackgroundColor('#635A7A')); // Background color for filled style

    
 
  // Add Tag Input
  var addTagInput = CardService.newTextInput()
    .setFieldName('addNewTagOneFileInput')
    .setTitle("Add Tag to File ➕")
    .setHint(' "E.g. Outstanding, Report, Follow-up..." ')
  

  // Set suggestions only if there are tags in library
  var allTags = getAllTagsName();
  if (allTags.length>0){
    addTagInput.setSuggestions(suggestTags(allTags))
  }


  // Add Tag Button
  var addTagButton = CardService.newTextButton()
    .setText('Confirm')
    .setOnClickAction(CardService.newAction()
      .setFunctionName('addNewTagFile')
      .setParameters({ selectedItems: JSON.stringify(selectedItems) }))
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
      .setBackgroundColor('#ffaf51'); // Background color for filled style


  // Display Tags & Number of file selected
  var tagsTitle = CardService.newGrid()
    .setNumColumns(1)
    .addItem(CardService.newGridItem()
        .setTitle('Shared Tags 🏷️') 
        .setSubtitle(`${selectedItems.length} files selected.`));

  var sharedTags =getSharedTags (selectedItems);

  Logger.log(sharedTags)

  var tagList = CardService.newButtonSet();
    if (sharedTags.length > 0) {
      var sortedTags = getSortedTags(sharedTags);
      sortedTags.forEach(tag => {
        tagList.addButton(CardService.newTextButton()
          .setText(tag.name)
          .setTextButtonStyle(CardService.TextButtonStyle.FILLED) // Optional: Adds a filled background style
          .setBackgroundColor('#8A4B3C') // Background color for filled style
          .setOnClickAction(CardService.newAction().setFunctionName('nothing')));
      });
    }


  // Manage One Display
  var headerManage = CardService.newCardSection()
    .addWidget(actionButtonSet);


  var addTagSection = CardService.newCardSection()
    .addWidget(addTagInput)
    .addWidget(addTagButton)
    .addWidget(spacing);


  var tagSection = CardService.newCardSection()
    .addWidget(tagsTitle)
    .addWidget(tagList);
  


  // Return the sections as an array
  return [headerManage, addTagSection, tagSection, spacer];
}

/**
 * The function to display get the shared tag id .
 */
function getSharedTags(selectedItems) {
  // Create an array to store tags for each file
  let tagsArrays = [];
  
  // Get tags for each selected file
  selectedItems.forEach(file => {
    let fileTagsData = getFileTagsDataById(file.id);
    
    if (fileTagsData && fileTagsData.tags) {
      tagsArrays.push(fileTagsData.tags);
    }
  });

  // Find shared tags
  if (tagsArrays.length === 0) return []; // No files or no tags in files

  // Find intersection of all tag arrays
  let sharedTags = tagsArrays.reduce((acc, tags) => {
    return acc.filter(tag => tags.includes(tag));
  });

  return sharedTags;
} 



/**
 * Function to retrieve data from fileTags Firebase Realtime Database.
 * Return data that macthes gmail(user) and file id (for a file only)
 * For manage page, Can be use for 1 file / multiple files selected 
 *  "fileTags": {
    "hash(gmail+fileid)": {
      "gmail": "gmail",
      "fileid": "hash(fileid)",
      "tags": [
        "id1",
        "Iid2",
        "id3"
      ]
    }
  }
 */
function getFileTagsDataById(fileId) {
  const url = `${FIREBASE_URL}/fileTags/${hash(email+fileId)}.json?auth=${FIREBASE_SECRET}`;

  const response = UrlFetchApp.fetch(url, {
    method: "GET",
    contentType: "application/json"
  });

  const data = JSON.parse(response.getContentText());

  return data;
}



/**
 * Function to retrieve data from tags Firebase Realtime Database with Tag ID
 */
function getTagDetails(tagId) {
  const url = `${FIREBASE_URL}/tags/${tagId}.json?auth=${FIREBASE_SECRET}`;

  const response = UrlFetchApp.fetch(url, {
    method: "GET",
    contentType: "application/json"
  });

  const data = JSON.parse(response.getContentText());

  return data;
}


/**
 * Function to get and sort tag details
 */
function getSortedTags(tagIds) {
  var tagDetailsArray = tagIds.map(tagId => {
    var tagDetails = getTagDetails(tagId);
    return {
      id: tagId,
      name: tagDetails.name
    };
  });

  // Sort the tags by name in ascending order
  tagDetailsArray.sort((a, b) => a.name.localeCompare(b.name));
  
  return tagDetailsArray;
}


/**
 * Function to retrieve all tag data from Firebase Realtime Database for the current user.
 */
function getAllTagsData(){
  const url = `${FIREBASE_URL}/tags.json?auth=${FIREBASE_SECRET}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      method: "GET",
      contentType: "application/json"
    });

    const data = JSON.parse(response.getContentText());

    // Filter tags for the current user
    const userTags = [];
    for (const key in data) {
      if (data[key].gmail === email) {
        userTags.push({ id: key, name: data[key].name });
      }
    }

    // Sort tags by name
    userTags.sort((a, b) => a.name.localeCompare(b.name));

    return userTags;

    } catch (e) {
      Logger.log('Error fetching tags: ' + e.toString());
      return [];
  }
}

/**
 * Function to retrieve all tags name from Firebase Realtime Database for the current user.
 * Return all tag names that match the user's email.
 */
function getAllTagsName() {
  var data = getAllTagsData();

  const userTags = Object.values(data).map(tag => tag.name);

  // Sort the tags in ascending order
  userTags.sort();

  return userTags;
}




/**
 * Function to display the suggestions
 * @param - tags: List of tag 
 */
function suggestTags (tags){
  var suggestion = CardService.newSuggestions()

  tags.forEach(function(tag) {
    suggestion.addSuggestion(tag)
  });
  
  return suggestion;
}



/**
 * Function to add a new tag to a file.
 */
function addNewTagFile(e) {

  if (!e.formInputs.addNewTagOneFileInput){
    return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
            .setText('Please enter a tag.'))
          .build();
  }

  var selectedItems = JSON.parse(e.parameters.selectedItems);
  var newTagObject = e.formInputs.addNewTagOneFileInput[0];
  var newTag = String(newTagObject).trim()
  var fileId = selectedItems[0].id;
  var hashId = hash(email + fileId);
  var newTagId = hash(email+newTag.toLowerCase())

  try {
    var url = `${FIREBASE_URL}/fileTags/${hashId}.json?auth=${FIREBASE_SECRET}`;

    // Check if the ID exists
    var response = UrlFetchApp.fetch(url, { method: 'GET' });
    var data = JSON.parse(response.getContentText());

    Logger.log(data)

    if (data) {
      // ID exists, add the new tag to the existing list
      if (!Array.isArray(data.tags)) {
        data.tags = [];
      }

      // Ensure no duplicates and avoid nested arrays
      if (!data.tags.includes(newTagId)) {
        data.tags.push(newTagId);
      } else{
        return CardService.newActionResponseBuilder()
          .setNotification(CardService.newNotification()
            .setText(`${newTag} already exists on this file.`))
          .build();
      }
      
    } else {
      // ID does not exist, create new data
      data = {
        fileid: hash(fileId),
        gmail: email,
        tags: [newTagId]
      };
    }

    // Update the database
    var options = {
      method: 'PUT', // Use PUT to replace the entire data
      contentType: 'application/json',
      payload: JSON.stringify(data)
    };

    UrlFetchApp.fetch(url, options);

    // Add new into database if it doesnt exist
    addTagIfNotExists(newTag)

    // Refresh page by returning the updated card
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(`${newTag} has been added to this file.`))
      .setNavigation(CardService.newNavigation().updateCard(onManagePage(selectedItems))) // Ensure this returns the updated card
      .build();
  
  } catch (e) {
    Logger.log('Error adding new tag: ' + e.toString());
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Failed to add tag.'))
      .build();
  }
}



/**
 * Function to add a new tag to the tags database if it doesn't already exist.
 * return true/false for library page, to indicate whether the tag existed
 */
function addTagIfNotExists(tagName) {
  const hashedid= hash(email+tagName.toLowerCase()); // Hash the email+tag name
  const url = `${FIREBASE_URL}/tags/${hashedid}.json?auth=${FIREBASE_SECRET}`;
  
  try {
    // Check if the tag exists
    var response = UrlFetchApp.fetch(url, { method: 'GET' });
    var data = JSON.parse(response.getContentText());

    if (!data) {
      // Tag does not exist, add it
      var newTagData = {
        gmail: email,
        name: tagName
      };

      var options = {
        method: 'PUT', // Use PUT to create or replace the tag data
        contentType: 'application/json',
        payload: JSON.stringify(newTagData)
      };

      UrlFetchApp.fetch(url, options);

      return true;
    } else {
      return false;
    }
  } catch (e) {
    Logger.log('Error checking/adding tag: ' + e.toString());
  }
}

/**
 * This function do nothing is to handle tag display
 */
function nothing(e) {}


/**
 * This function change the edit mode when user selected the files.
 */
function changeEditModeFile(e) {
  var selectedItems = JSON.parse(e.parameters.selectedItems);
  var isEditMode = !(e.parameters.isEditMode === 'true'); //if edit mode is false become true

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(onManagePage(selectedItems, isEditMode)))
    .build();
}

/**
 * This function change the edit mode in the library page.
 */
function changeEditModeLibrary(e) {
  var isEditMode = !(e.parameters.isEditMode === 'true'); //if edit mode is false become true
Logger.log(isEditMode)
  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().updateCard(onLibraryPage(e, isEditMode)))
    .build();
}


/**
 * Remove tags from a file.
 */
function removeFileTag(e) {
  // Check if any tags are selected for removal
  if (!e.formInputs.tagsToDelete) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Please select at least tag to remove.'))
      .build();
  }

  // Extract the selected tag IDs
  var selectedTagsId = e.formInputs.tagsToDelete.map(tag => JSON.parse(tag).id);
  var selectedTagsName = e.formInputs.tagsToDelete.map(tag => JSON.parse(tag).name);

  var selectedItems = JSON.parse(e.parameters.selectedItems);
  var fileId = e.parameters.fileId;
  var hashId = hash(email + fileId);

  try {
    // Fetch the current tags for the file
    var fileTagsData = getFileTagsDataById(fileId);
    
    if (!fileTagsData || !fileTagsData.tags) {
      return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification()
          .setText('No tags found for this file.'))
        .build();
    }

    // Remove the selected tags from the existing tags
    var updatedTags = fileTagsData.tags.filter(tagId => !selectedTagsId.includes(tagId));

    // Check if updatedTags is empty, if so, delete the document
    if (updatedTags.length === 0) {
      var deleteUrl = `${FIREBASE_URL}/fileTags/${hashId}.json?auth=${FIREBASE_SECRET}`;
      var deleteOptions = {
        method: 'DELETE'
      };

      UrlFetchApp.fetch(deleteUrl, deleteOptions);
    } 
    // Update the database with the new list of tags
    else{
      var updatedData = {
            fileid: hash(fileId),
            gmail: email,
            tags: updatedTags
          };

          var url = `${FIREBASE_URL}/fileTags/${hashId}.json?auth=${FIREBASE_SECRET}`;
          var options = {
            method: 'PUT',
            contentType: 'application/json',
            payload: JSON.stringify(updatedData)
          };

          UrlFetchApp.fetch(url, options);
    }
   
    // Notify the user
    var notificationText = selectedTagsName.length > 0 ? 
      `${selectedTagsName.join(', ')} have been removed from this file.` : 
      'No tags were removed.';

    // Refresh page (not in editmode) by returning the updated card
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(notificationText))
      .setNavigation(CardService.newNavigation().updateCard(onManagePage(selectedItems))) 
      .build();

  } catch (e) {
    Logger.log('Error removing tags: ' + e.toString());
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('Failed to remove tags.'))
      .build();
  }
}



/**
 * Hashes using SHA-256.
 */
function hash(input) {
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, input);
  var hash = rawHash.map(function(byte) {
    var v = (byte < 0) ? 256 + byte : byte;
    return ('0' + v.toString(16)).slice(-2);
  }).join('');
  return hash;
}


function onItemsSelected(e) {

  var selectedItems = e.drive.selectedItems;

  if (!selectedItems || selectedItems.length === 0) {

    // Redirect to Library Page
    return onLibraryPage();
  }
  
  return onManagePage(selectedItems);
}

function showAddLabelCard() {}


function showRemoveLabelCard() {}


function showLabelContentCard() {}


function getSimplifiedMimeType(mimeType) {
  switch (mimeType) {
    case 'application/vnd.google-apps.document':
      return 'Google Docs';
    case 'application/vnd.google-apps.spreadsheet':
      return 'Google Sheets';
    case 'application/vnd.google-apps.presentation':
      return 'Google Slides';
    case 'application/vnd.google-apps.form':
      return 'Google Forms';
    case 'application/vnd.google-apps.drawing':
      return 'Google Drawing';
    case 'application/vnd.google-apps.site':
      return 'Google Sites';
    case 'application/vnd.google-apps.map':
      return 'Google My Maps';
    case 'application/pdf':
      return 'PDF';
    case 'image/jpeg':
      return 'JPEG Image';
    case 'image/png':
      return 'PNG Image';
    case 'video/mp4':
      return 'MP4 Video';
    case 'audio/mpeg':
      return 'MP3 Audio';
    case 'text/plain':
      return 'Text File';
    case 'text/csv':
      return 'CSV File';
    case 'application/zip':
      return 'ZIP Archive';
    case 'application/vnd.google-apps.script':
      return 'Apps Script';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Microsoft Word Document';
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'Microsoft Excel Spreadsheet';
    case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      return 'Microsoft PowerPoint Presentation';
    case 'application/epub+zip':
      return 'EPUB eBook';
    case 'application/msword':
      return 'Microsoft Word 97-2003 Document';
    case 'application/vnd.ms-excel':
      return 'Microsoft Excel 97-2003 Spreadsheet';
    case 'application/vnd.ms-powerpoint':
      return 'Microsoft PowerPoint 97-2003 Presentation';
    case 'application/vnd.oasis.opendocument.text':
      return 'OpenDocument Text';
    case 'application/vnd.oasis.opendocument.spreadsheet':
      return 'OpenDocument Spreadsheet';
    case 'application/vnd.oasis.opendocument.presentation':
      return 'OpenDocument Presentation';
    case 'application/rtf':
      return 'Rich Text Format';
    case 'application/x-tar':
      return 'TAR Archive';
    case 'application/vnd.visio':
      return 'Microsoft Visio Document';
    case 'application/vnd.ms-project':
      return 'Microsoft Project Document';
    case 'application/x-sh':
      return 'Shell Script';
    case 'application/x-python-code':
      return 'Python Script';
    case 'application/x-javascript':
      return 'JavaScript File';
    case 'application/json':
      return 'JSON File';
    case 'application/xml':
      return 'XML File';
    case 'image/gif':
      return 'GIF Image';
    case 'image/bmp':
      return 'BMP Image';
    case 'image/tiff':
      return 'TIFF Image';
    case 'audio/wav':
      return 'WAV Audio';
    case 'audio/ogg':
      return 'OGG Audio';
    case 'video/webm':
      return 'WEBM Video';
    case 'video/avi':
      return 'AVI Video';
    case 'video/mpeg':
      return 'MPEG Video';
    case 'text/html':
      return 'HTML File';
    case 'application/x-httpd-php':
      return 'PHP Script';
    case 'application/x-7z-compressed':
      return '7z Archive';
    case 'application/x-rar-compressed':
      return 'RAR Archive';
    case 'application/x-bzip2':
      return 'BZ2 Archive';
    case 'application/x-xz':
      return 'XZ Archive';
    case 'application/x-csh':
      return 'C Shell Script';
    case 'application/x-java-archive':
      return 'Java Archive (JAR)';
    case 'application/x-tex':
      return 'TeX Document';
    case 'application/x-latex':
      return 'LaTeX Document';
    case 'application/x-sql':
      return 'SQL Database File';
    case 'application/x-msaccess':
      return 'Microsoft Access Database';
    case 'application/x-iso9660-image':
      return 'ISO Image';
    case 'application/x-wine-extension-dll':
      return 'Windows DLL';
    case 'application/x-matroska':
      return 'Matroska Video';
    case 'application/x-apple-diskimage':
      return 'Apple Disk Image';
    case 'application/x-ruby':
      return 'Ruby Script';
    case 'application/x-perl':
      return 'Perl Script';
    case 'application/x-objc':
      return 'Objective-C Source Code';
    case 'application/x-objc++':
      return 'Objective-C++ Source Code';
    case 'application/x-shellscript':
      return 'Shell Script';
    case 'application/x-sqlite3':
      return 'SQLite Database';
    case 'application/x-texinfo':
      return 'Texinfo Document';
    case 'application/x-mspublisher':
      return 'Microsoft Publisher Document';
    case 'application/x-spss-sav':
      return 'SPSS Data File';
    case 'application/x-spss-sps':
      return 'SPSS Syntax File';
    case 'application/x-dwg':
      return 'AutoCAD Drawing';
    case 'application/x-dxf':
      return 'AutoCAD Drawing Exchange Format';
    case 'application/x-vsd':
      return 'Microsoft Visio Drawing';
    case 'application/x-psp':
      return 'PlayStation Portable File';
    case 'application/x-ps':
      return 'PostScript File';
    case 'application/x-cab':
      return 'Windows Cabinet File';
    case 'application/vnd.jgraph.mxfile':
      return 'Draw.io';
    default:
      return mimeType; // Return the original MIME type if no match is found
  }
}
