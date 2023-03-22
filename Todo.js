

$(document).ready(function () {
    printMatrix();

    $('#divTaskDetails').dialog({
        autoOpen: false,
        title: 'Task Details',
        height: 500,
        width: 900
    });

    $('#divUtility').dialog({
        autoOpen: false,
        title: 'Utilities',
        height: 200,
        width: 900,
        position: 'center'
    });

    $('#divAbout').dialog({
        autoOpen: false,
        title: 'About Eisenhower Matrix',
        height: 600,
        width: 900,
        position: 'center'
    });
});


var vLocalStorageNameConstant = "urgentAndImportantAppStorage1";

function vLocalStorageName() {
    return vLocalStorageNameConstant + "_" + $("#ddlArea").children("option:selected").val();
}

function SwitchStorage() {
    printMatrix();
}

var allTasks =
{
    queue:
        [
        ]
};


function allTasksForAllStorages(vname, vtasks) {
    this.Name = vname,
        this.Q = vtasks
}

function Generator() { };
Generator.prototype.rand = Math.floor(Math.random() * 26) + Date.now();

Generator.prototype.getId = function () {
    return this.rand++;
};

var idGen = new Generator();

function Task(id, taskTitle, quadrant, status, desc, timeEstimates, timeSpent, isFollowUp, isOnHold, isRecurring, recurrenceType) {
    this.Id = id,
        this.Name = taskTitle,
        this.Q = quadrant,
        this.Status = status == null ? "Not Started" : status,
        this.TimeEstimates = (timeEstimates == null) ? 0 : timeEstimates,
        this.TimeSpent = (timeSpent == null) ? 0 : timeSpent,
        this.Description = (desc == null) ? "No Description" : desc,
        this.isFollowUp = (isFollowUp == null) ? false : isFollowUp,
        this.isOnHold = (isOnHold == null) ? false : isOnHold,
        this.isRecurring = (isRecurring == null) ? false : isRecurring,
        this.RecurrenceType = (recurrenceType == null) ? "None" : recurrenceType,
        this.getInfo = function () {
            return this.Id + ' ' + this.Name;
        };
}

function TaskToString() {
    return this.Id + ' ' + this.Name + '' + this.Q;
}


function printMatrix() {

    var totalTasksHours = 0;

    $("#ulIU").find("li").remove();
    $("#ulNIU").find("li").remove();
    $("#ulINU").find("li").remove();
    $("#ulNINU").find("li").remove();
    $("#ulFU").find("li").remove();

    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));

    var taskTypeToBeShown = $("#ddlTaskTypes").val();
    var showOnHoldTasks = $("#chkShowOnHold").is(":checked");
    var showRecurringTasks = $("#chkShowRecurring").is(":checked");

    //if (allTasksFromLocalStorage != null) {
    //    console.log("Total Tasks - " + allTasksFromLocalStorage.queue.length);
    console.log("Matrix Print started");
	
	if(allTasksFromLocalStorage != null && allTasksFromLocalStorage != undefined && allTasksFromLocalStorage.queue != null && allTasksFromLocalStorage.queue != undefined)
	{	

    for (var i = 0; i < allTasksFromLocalStorage.queue.length; i++) {

        var vTask = allTasksFromLocalStorage.queue[i];

        if (vTask.Status == "Done" || vTask.Status == "Archived") {
            continue;
        }

        //if (showOnHoldTasks != true && vTask.isOnHold == true)
        //    continue;

        //if (showRecurringTasks != true && vTask.isRecurring == true)
        //    continue;

        if (taskTypeToBeShown == 'showAll')
            appendTaskBlock(vTask.Q, vTask);
        else if (taskTypeToBeShown == 'showToBeFollowedUp' && vTask.isFollowUp == true)
            appendTaskBlock(vTask.Q, vTask);
        else if (vTask.isFollowUp == undefined || (taskTypeToBeShown == 'showOnlyMyTasks' && vTask.isFollowUp == false))
            appendTaskBlock(vTask.Q, vTask);

        var vEstimates = vTask.TimeEstimates;

        if (vEstimates == '' || vEstimates ==' ' || vEstimates == null || isNaN(vEstimates) == true || vEstimates == undefined) {
            vEstimates = 0;          
        }

      totalTasksHours += parseFloat(vEstimates);
    }


		$("#spanUI").text($("#ulIU").find("li").length);
		$("#spanUNI").text($("#ulNIU").find("li").length);
		$("#spanINU").text($("#ulINU").find("li").length);
		$("#spanNINU").text($("#ulNINU").find("li").length);
		$("#spanFU").text($("#ulFU").find("li").length);


		$("#spanTotalCount").text($("#ulIU").find("li").length +
		$("#ulNIU").find("li").length + $("#ulINU").find("li").length + $("#ulNINU").find("li").length
		);


		$("#spanTotalHours").text(totalTasksHours);

		$("#spanTotalCountFollowups").text($("#ulFU").find("li").length);
	}
	else
	{
		$("#spanUI").text("0");
		$("#spanUNI").text("0");
		$("#spanINU").text("0");
		$("#spanNINU").text("0");
		$("#spanFU").text("0");


		$("#spanTotalCount").text("0");
		$("#spanTotalHours").text("0");

		$("#spanTotalCountFollowups").text("0");
	}
}

function popIt() {
    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));
    allTasksFromLocalStorage.queue.shift();
    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
    printMatrix();
}

function pushIt(vTaskTitle, vTaskType) {

    var vTask = new Task(idGen.getId(), vTaskTitle, vTaskType);

    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));

    if (allTasksFromLocalStorage == null) {
        localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasks));
        allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));
    }

    allTasksFromLocalStorage.queue.push(vTask);

    appendTaskBlock(vTask.Q, vTask);
    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
}

function appendTaskBlock(vTaskQuadrant, vTask) {
    var liNode = document.createElement("LI");

    var vColor = (vTask.isOnHold == true) ? "itemLightGrey" : "";
    vColor = (vTask.isRecurring == true) ? "itemLightGreen" : vColor;
    vColor = (vTask.isRecurring == true) && (vTask.isOnHold == true) ? "itemOrange" : vColor;

    if (vTask.isFollowUp)
        vColor = "itemFollowUp";

    liNode.setAttribute("class", "list-group-item d-flex justify-content-between align-items-center " + vColor + " taskListItem");
    liNode.setAttribute("id", "liTask_" + vTask.Id);
    var vFollowUpIcon = "<svg style=margin-right:3px; xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-clipboard-check' viewBox='0 0 16 16'>";
    vFollowUpIcon += " <path fill-rule='evenodd' d='M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z' />";
    vFollowUpIcon += " <path d='M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z' />";
    vFollowUpIcon += "  <path d='M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z' />";
    vFollowUpIcon += "</svg>";

    if (vTask.isFollowUp)
        taskTitle = "<label>" + vFollowUpIcon + vTask.Name + "</label>";
    else
        taskTitle = "<label>" + vTask.Name + "</label>";

    var vDeleteIcon = "<span class='badge bg-primary rounded-pill'> <svg  id=svgDeleteButton_" + vTask.Id + " xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>";
    vDeleteIcon += " <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'></path>";
    vDeleteIcon += "<path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'></path> </svg>   </span>";

    liNode.innerHTML = taskTitle + vDeleteIcon;

    $('#ul' + vTaskQuadrant).append(liNode);
    $("#liTask_" + vTask.Id).click(function () { TaskDetails(vTask.Id); });

    $("#svgDeleteButton_" + vTask.Id).click(function () { DeleteTask(vTask.Id); });
}


function TaskDetails(vId) {

    $('#btnAddToFollowUp').hide();
    $('#btnUnollowUp').hide();
    $('#btnAddToOnHold').hide();
    $('#btnRemoveFromOnHold').hide();
    $('#btnMakeRecurring').hide();
    $('#btnRemoveFromRecurring').hide();

    $('#divTaskDetails').dialog('open');

    var vTask = GetTaskById(vId);

    $("#selecedTaskId").val(vId);

    var vTaskTitleTemp = vTask.Name;

    $("#h4TaskName").html(vTaskTitleTemp);

    if (vTask.Description != undefined)
        $("#h5Description").html(vTask.Description);

    var vbtnLinkInTaskDetails = $("#btnLinkInTaskDetails");

    if (vTaskTitleTemp.toLowerCase().indexOf("http:") != -1
        || vTaskTitleTemp.toLowerCase().indexOf("www") != -1
        || vTaskTitleTemp.toLowerCase().indexOf("https:") != -1) {
        vbtnLinkInTaskDetails.show();
        vbtnLinkInTaskDetails.attr("link", vTaskTitleTemp);
    }
    else {
        vbtnLinkInTaskDetails.hide();
    }

    if (vTask.TimeEstimates != undefined)
        $("#txtEstimates").val(vTask.TimeEstimates);

    if (vTask.isFollowUp != undefined) {
        if (vTask.isFollowUp == false) {
            $('#btnAddToFollowUp').show();
            $('#btnUnollowUp').hide();
        }
        else {
            $('#btnAddToFollowUp').hide();
            $('#btnUnollowUp').show();
        }
    }
    else {
        $('#btnAddToFollowUp').show();
    }

    if (vTask.isOnHold != undefined) {
        if (vTask.isOnHold == false) {
            $('#btnAddToOnHold').show();
            $('#btnRemoveFromOnHold').hide();
        }
        else {
            $('#btnAddToOnHold').hide();
            $('#btnRemoveFromOnHold').show();
        }
    }
    else {
        $('#btnAddToOnHold').show();
    }

    if (vTask.isRecurring != undefined) {
        if (vTask.isRecurring == false) {
            $('#btnMakeRecurring').show();
            $('#btnRemoveFromRecurring').hide();
        }
        else {
            $('#btnMakeRecurring').hide();
            $('#btnRemoveFromRecurring').show();
        }
    }
    else {
        $('#btnMakeRecurring').show();
    }
}

function openLink() {
    var vbtnLinkInTaskDetails = $("#btnLinkInTaskDetails");

    var link = vbtnLinkInTaskDetails.attr("link");


    window.open(link);
}

function EditTaskContent(vType, vContentElementId) {
    var vId = $("#selecedTaskId").val();
    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));
    for (var i = 0; i < allTasksFromLocalStorage.queue.length; i++) {
        if (allTasksFromLocalStorage.queue[i].Id.toString() == vId.toString()) {

            if (vType == "name") {
                allTasksFromLocalStorage.queue[i].Name = $("#" + vContentElementId).html();
            }
            else if (vType == "description") {
                allTasksFromLocalStorage.queue[i].Description = $("#" + vContentElementId).html();
            }
            else if (vType == "addtofollowup") {
                allTasksFromLocalStorage.queue[i].isFollowUp = true;
            }
            else if (vType == "unfollow") {
                allTasksFromLocalStorage.queue[i].isFollowUp = false;
            }
            else if (vType == "addtoonhold") {
                allTasksFromLocalStorage.queue[i].isOnHold = true;
            }
            else if (vType == "removefromonhold") {
                allTasksFromLocalStorage.queue[i].isOnHold = false;
            }
            else if (vType == "makerecurring") {
                allTasksFromLocalStorage.queue[i].isRecurring = true;
            }
            else if (vType == "removefromrecurring") {
                allTasksFromLocalStorage.queue[i].isRecurring = false;
            }
            else
                alert("Edit of this attribute not implemented. Attribute: " + vType);

            break;
        }
    }
    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
    printMatrix();
}

function ChangeTaskQ(vNewQ) {
    var vId = $("#selecedTaskId").val();


    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));

    for (var i = 0; i < allTasksFromLocalStorage.queue.length; i++) {
        if (allTasksFromLocalStorage.queue[i].Id.toString() == vId.toString()) {

            allTasksFromLocalStorage.queue[i].Q = vNewQ;
        }
    }

    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
    printMatrix();
}

function ChangeTaskEstimates() {

    var vId = $("#selecedTaskId").val();

    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));

    for (var i = 0; i < allTasksFromLocalStorage.queue.length; i++) {
        if (allTasksFromLocalStorage.queue[i].Id.toString() == vId.toString()) {

            allTasksFromLocalStorage.queue[i].TimeEstimates = $("#txtEstimates").val();

            // $("#txtEstimates").val('');
        }
    }

    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
    printMatrix();
}

function DeleteTask(vId) {

    event.stopPropagation();

    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));

    for (var i = 0; i < allTasksFromLocalStorage.queue.length; i++) {
        if (allTasksFromLocalStorage.queue[i].Id.toString() == vId.toString()) {

            allTasksFromLocalStorage.queue[i].Status = "Done";
            break;
        }
    }
    localStorage.setItem(vLocalStorageName(), JSON.stringify(allTasksFromLocalStorage));
    printMatrix();

    return false;
}

function addTask(vTxtId, vTaskType) {
    if ($("#" + vTxtId).val() != '' && $("#" + vTxtId).val() != '') {
        pushIt($("#" + vTxtId).val(), vTaskType);
        $("#" + vTxtId).val('');
    }
    return false;
}


function GetAllTasks() {
    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vLocalStorageName()));
    return allTasksFromLocalStorage;
}

function GetAllTasksForStorage(vStorageNameForTasks) {
    var allTasksData = JSON.parse(localStorage.getItem(vStorageNameForTasks));
    return allTasksData;
}

function GetTaskById(vId) {
    var allTasks = GetAllTasks();

    for (var i = 0; i < allTasks.queue.length; i++) {
        if (allTasks.queue[i].Id.toString() == vId.toString()) {
            return allTasks.queue[i];
        }
    }
}

function clearStorage() {
    if (confirm("Would you like to DELETE ALL tasks ? Its good idea to take backup by exporting.")) {
        $('#ddlArea > option').each(function () {
            var vTempLocalStorageName = vLocalStorageNameConstant + "_" + $(this).val();
            var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vTempLocalStorageName));

            if (allTasksFromLocalStorage != null) {
                localStorage.setItem(vTempLocalStorageName, JSON.stringify(allTasks));
            }
        });

        printMatrix();
    }
}


function downloadCompleteData() {
    var vArray = new Array();
    $('#ddlArea > option').each(function () {
        var vTempLocalStorageName = vLocalStorageNameConstant + "_" + $(this).val();
        var vData = GetAllTasksForStorage(vTempLocalStorageName);
        var vStorage = new allTasksForAllStorages(vTempLocalStorageName, vData);
        vArray.push(vStorage);
    });


    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');
    var fileName = "MyNotesLocalStorageJSON_" + formattedDate;

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vArray));
    var dlAnchorElem = document.getElementById('downloadAnchorElemDummy');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", fileName + ".json");
    dlAnchorElem.click();
}


function ReadAndSetJSON() {
    var vJSONData = $("#txtJSONData").val();

    var obj = jQuery.parseJSON(vJSONData);

    for (var i = 0; i < obj.length; i++) {

        var vSegment = obj[i];
        var storagename = vSegment.Name;

        if (vSegment.Q != null) {
            var taskArray = vSegment.Q.queue;
            for (var taskCounter = 0; taskCounter < taskArray.length; taskCounter++) {
                var objNewTask = taskArray[taskCounter];
                AddTaskFromJSON(objNewTask.Name, objNewTask.Q, storagename, objNewTask.Status, objNewTask.TimeEstimates, objNewTask.TimeSpent, objNewTask.Description, objNewTask.isFollowUp, objNewTask.isOnHold, objNewTask.isRecurring, objNewTask.RecurrenceType);
            }
        }
    }
    return false;
}

function AddTaskFromJSON(vTaskTitle, vTaskType, vStorageNameOfTask, vStatus, vTimeEstimates, vTimeSpent, vDesc, vIsFollowUp, vIsOnHold, vIsRecurring, vRecurrenceType) {
    var vTask = new Task(idGen.getId(), vTaskTitle, vTaskType, vStatus, vDesc, vTimeEstimates, vTimeSpent, vIsFollowUp, vIsOnHold, vIsRecurring, vRecurrenceType);

    var allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vStorageNameOfTask));

    if (allTasksFromLocalStorage == null) {
        localStorage.setItem(vStorageNameOfTask, JSON.stringify(allTasks));
        allTasksFromLocalStorage = JSON.parse(localStorage.getItem(vStorageNameOfTask));
    }
    allTasksFromLocalStorage.queue.push(vTask);

    appendTaskBlock(vTask.Q, vTask);
    localStorage.setItem(vStorageNameOfTask, JSON.stringify(allTasksFromLocalStorage));
}


function OpenMenu() {
    $("#divUtility").dialog({
        autoOpen: false,
        maxHeight: 580,
        width: 1000,
        height: 300,
        position: { my: "center center", at: "center center", of: window }
    });

    return $('#divUtility').dialog('open');
}

function OpenAboutMatrix() {

    $("#divAbout").dialog({
        autoOpen: false,
        maxHeight: 500,
        width: 1000,
        height: 500,
        position: { my: "center center", at: "center center", of: window }
    });

    return $('#divAbout').dialog('open');
}
