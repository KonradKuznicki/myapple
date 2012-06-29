function Progress (appendTo) {
	
	var tmp = new Object();	

	tmp.object = $('<div class="progress" style="width: 300px;"><div class="animation"></div><div class="shadow"></div></div><div class="progress_debug"></div>').appendTo(appendTo);	

	tmp.setProgress = function (progress) {
		this.object.find(".animation").css({width: progress+"%"});
	};

	tmp.remove = function () {
		this.object.remove();
	};

	return tmp;
}
