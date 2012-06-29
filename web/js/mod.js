/**
 * 
 */

mod = {
		
	concurent_uploads : 0,
	uload_status_visible : false,
			
	ajax_entry_location : "",
	ajax_photo_location : "",
	
	send : function () {
		
		dta = {entry:{}};
		
		dta.entry._token = $("#entry__token").val();
		dta.entry.content = $("#entry_content").val();
		dta.entry.photo = $("#entry_photo").val();

		if(dta.entry.content == "Wiadomość...") return alert("Wstaw jakąś treść");		

		$("#entry_content").val("");
		$("#entry_content").focus();

		mod.reset_photo();		
		
		mod.add_upload();
		
		$.post(mod.ajax_entry_location, dta, mod.answer);
	},

	reset_photo : function () {
		$("#entry_photo").val("");
		$("#uploaded_photo").html("");
		mod.resizeTextArea();
	},

	add_upload : function () {
		mod.concurent_uploads++;
		mod.refresh_status();
	},
	
	remove_upload : function () {
		mod.concurent_uploads--;
		mod.refresh_status();
	},
	
	refresh_status : function () {
		if(mod.upload_status_visible && mod.concurent_uploads == 0)
		{
			mod.upload_status_visible = false;
			$("#uploadInProgres").hide();
		}
		else if(!mod.upload_status_visible && mod.concurent_uploads > 0)
		{
			mod.upload_status_visible = true;
			$("#uploadInProgres").show();
		}
		
		$("#uploadInProgres span").html(mod.concurent_uploads);
	},
	
	answer : function () {
		mod.remove_upload();
	},
		
	resizeTextArea : function () {
		
		c = $("#entry_content");
		
		c.css({height : 0});
		
		h = c[0].scrollHeight;
		
		c.css({height : h});
		
		$("#stack").css({"margin-top" : $("#entry10000").height()+50});
		
	},
		
	refresh : function () {
		
		var stime = new Array();
		
		var time = new Date();

		h = time.getHours();
		if(h < 10) h = "0"+h;

		m = time.getMinutes();
		if(m < 10) m = "0"+m;

		s = time.getSeconds();
		if(s < 10) s = "0"+s;
		
		dat = h + ":" + m + ":" + s;
		
		
		$("#dodaj .time span:nth-child(2)").html(dat);	
		
		$("#dodaj .sign span span").html(engine.state.counter+1);
		
	},
	
	
	newUploader : function () {
		
	},
	
	
	on_leave_text : "Wiadomość...",
	
	leave : function () {
		if($.trim($("#entry_content").val()).length == 0) $("#entry_content").val(mod.on_leave_text);
	},
	
	enter : function () {
		if($.trim($("#entry_content").val()) == mod.on_leave_text) $("#entry_content").val("");
	},
	
	registerEvents : function () {
		
		$("#entry_content").focusout(mod.leave);
		$("#entry_content").focus(mod.enter);
		$("#entry_content").focus();
		
		$("#entry_content").keypress(mod.resizeTextArea);
		$("#entry_content").keyup(mod.resizeTextArea);
		$("#entry_content").keydown(mod.resizeTextArea);
	},
	
	init : function () {
		
		swf.init();		

		mod.ajax_photo_location = $("form[name='photo']").attr("action");
		mod.ajax_entry_location = $("form[name='entry']").attr("action");
		
		mod.registerEvents();	
	
		mod.resizeTextArea();
		
		setInterval("mod.refresh();",1000);

		$("#save input").click(mod.send);
		$("#save input")[0].type="button";

	}
};

$(document).ready(function () { mod.init(); });
