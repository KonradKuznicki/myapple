function preLoad() {
	if (!this.support.loading) {
		alert("You need the Flash Player 9.028 or above to use SWFUpload.");
		return false;
	}
}
function loadFailed() {
	alert("Something went wrong while loading SWFUpload. If this were a real application we'd clean up and then give you an alternative");
}

/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileDialogComplete(numFilesSelected, numFilesQueued) {
	//this.startUpload();
	this.startResizedUpload(undefined, 1000, 1000, SWFUpload.RESIZE_ENCODING.JPEG, 100);
}

function uploadSuccess(file, serverData) {
	alert("asdf");
	try {
		document.getElementById("divStatus").innerHTML = this.getStats().successful_uploads + " files uploaded";
		
		var p = document.createElement("p");
		p.innerHTML = "FlashCookie set to " + serverData;
		document.getElementById("divCookieValues").appendChild(p);
	} catch (ex) {

	}
}
