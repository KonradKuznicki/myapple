swf = {

	instance : null,
	
	progress : null,

	init : function () {
		settingsaa = {
			flash_url : "/swfupload/swfupload.swf",
			flash9_url : "/swfupload/swfupload_FP9.swf",
			upload_url: "/app_dev.php/Admin/AJAX/photo",//mod.ajax_photo_location,
			file_size_limit : "5 MB",
			file_post_name : $("#photo_photo").attr("name"), 
			// Button Settings
			button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,

			button_placeholder_id : "put_swfupload_here",
		//	button_image_url : "/upload_photo.png",
			button_text : "<span class='theFont'>Wybierz zdjęcie</span>",
			button_text_style: ".theFont { font-size: 12px; font-family: Lucida Grande; color: #9E9E9E }",
			button_width: 150,
			button_height: 22,
			button_action: SWFUpload.BUTTON_ACTION.SELECT_FILE,
			button_cursor: SWFUpload.CURSOR.HAND,


			file_types : "*.jpg; *.JPG; *.jpeg; *.JPEG",

			debug : true,
			debug_handler : swf.debug,
			
			swfupload_preload_handler : preLoad,
			swfupload_load_failed_handler : loadFailed,
			file_dialog_complete_handler : swf.onFileDialogComplete,
			upload_success_handler : swf.onUpload
		};	
		swf.instance = new SWFUpload(settingsaa);
	},

	photo : "",

	debug_counter : 0,
	debug_counter_start : 0,
	debug : function (msg) {
		swf.debug_counter++;
		p = Math.round(((swf.debug_counter - swf.debug_counter_start)/13)*100);
		
		if(swf.progress)swf.progress.setProgress(p);
	
		//$(".progress_debug").html(swf.debug_counter + " " +msg);
	},

	onUpload : function (smth, photo_name) {
		swf.photo = $.trim(photo_name);
		
		if(swf.photo.length == 32) {
			$("#entry_photo").val(swf.photo);
			$("#uploaded_photo").html("<div class='image'><img src='/photos/"+swf.photo+".jpg' onload='mod.resizeTextArea();'><span onclick='mod.reset_photo()'>X</span></div>");
			mod.resizeTextArea();
		}else{
			$("#uploaded_photo").html("Wystąpił błąd proszę o ponowne przesłanie zdjęcia");
		}
		$("#entry_content").focus();
	},

	onFileDialogComplete : function (desc) {
		if(!desc) return;
		swf.debug_counter_start = swf.debug_counter;
		swf.progress = new Progress("#uploaded_photo");
		swf.progress.setProgress(0);
		this.startResizedUpload(undefined, 1000, 1000, SWFUpload.RESIZE_ENCODING.JPEG, 80);
	}
};

