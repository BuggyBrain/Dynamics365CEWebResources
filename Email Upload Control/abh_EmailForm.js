//// For OnLoad Event on email form to set visibility of the control 
function ShowUploadControl()
{
    if(Xrm.Page.ui.getFormType() == 2)
        {
            Xrm.Page.getControl("WebResource_DragDropUI").setVisible(true);
        }
}