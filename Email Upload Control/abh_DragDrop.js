(function (window) {
    function triggerCallback(e, callback) {
        if (!callback || typeof callback !== 'function') {
            return;
        }
        var files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        callback.call(null, files);
    }

    function makeDroppable(ele, callback) {
        var input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('multiple', true);
        input.style.display = 'none';
        input.addEventListener('change', function (e) {
            triggerCallback(e, callback);
        });
        ele.appendChild(input);

        ele.addEventListener('dragenter', function (event) {
	    if (event.preventDefault) event.preventDefault();
	
            return false;
		});

        ele.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.add('dragover');
        });

        ele.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.remove('dragover');
        });

        ele.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            ele.classList.remove('dragover');
            triggerCallback(e, callback);
        });

        ele.addEventListener('click', function () {
            input.value = null;
            input.click();
        });
    }

    window.makeDroppable = makeDroppable;
    })(this);


(function (window) {
    makeDroppable(window.document.querySelector('.demo-droppable'), function (files) {
        console.log(files);
        var output = document.querySelector('.output');
        output.innerHTML = '';
        for (var i = 0; i < files.length; i++) {
           output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle">Attaching File : </span><span class="abhCrmAppMessageBarMessage">"' + files[i].name + '"</span></div>';
            AttachFile(files[i]);
        }
    });
})(this);


function AttachFile(attachedFile) {  
    var output = document.querySelector('.output');
var iFileSize = attachedFile.size;
if (parent.Xrm.Page.ui.getFormType() == 2){
if(iFileSize < 10485760)
{
  output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle">Uploading File : </span><span class="abhbCrmAppMessageBarMessage">"' + attachedFile.name + '" is uploading</span></div>';
    var reader = new FileReader();    
    console.log("File Reader Object Created");


       //reader.readAsDataURL(attachedFile);
	reader.readAsBinaryString(attachedFile);


    reader.onload = function (e) {
        console.log("Inside onload");
        console.log(reader.result);
		
        var arrBuffer = reader.result;
		
                            
        var selectedIds = parent.Xrm.Page.data.entity.getId();
        
        //Email attachment parameters
        var activitymimeattachment = Object();
        activitymimeattachment.ObjectId = Object();
        activitymimeattachment.ObjectId.LogicalName = "email";
        activitymimeattachment.ObjectId.Id = parent.Xrm.Page.data.entity.getId(); //email1.ActivityId;
        activitymimeattachment.ObjectTypeCode = "email";
        activitymimeattachment.Subject = "File Attachment";
        activitymimeattachment.Body = btoa(arrBuffer);
        activitymimeattachment.FileName = attachedFile.name;
                
        activitymimeattachment.MimeType = attachedFile.type;

        SDK.REST.createRecord(activitymimeattachment, "ActivityMimeAttachment", ActivityMimeAttachmentCallBack, function (error) {
            console.log(error.message);
if(error.message.includes("Error : 500: Internal Server Error: File name")&&error.message.includes("is invalid")){
output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle"> Failed to Upload File : </span><span class="abhCrmAppMessageBarMessage">The file you are trying to attach is not a valid File Type by the system</span></div>';
}
else{
            output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle"> Failed to Upload File : </span><span class="abhCrmAppMessageBarMessage">Some error occured while uploading file.</span></div>';
}
        });

        function ActivityMimeAttachmentCallBack(result) {
            console.log('file attached');
           output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle">File Uploaded : </span><span class="abhCrmAppMessageBarMessage">"' + attachedFile.name + '" is uploaded Successfully.</span></div>';
            var subgrid = parent.Xrm.Page.ui.controls.get("attachmentsGrid");
            subgrid.refresh();
        }
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
         output.innerHTML = '<div class = "message"> <span class="abhCrmAppMessageBarTitle">Failed to Upload File : </span><span class="abhCrmAppMessageBarMessage">Some error occured, please try to upload file again.</span></div>';
           
    };
}
else
{
output.innerHTML = '<div class = "message"><span class="abhCrmAppMessageBarTitle">Failed to Upload File :  </span><span class="abhCrmAppMessageBarMessage">File size should be less than 10 MB</span></div>';
}}
else
{
output.innerHTML = '<div class="message"><span class="abhCrmAppMessageBarTitle">Failed to Upload File : </span><span class="abhCrmAppMessageBarMessage">Save the record before you attach the file</span></div>';
}
}