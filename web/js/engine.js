function nodeToXML(node, indentation, out) {
   out += indentation+"<"+node.nodeName.toLowerCase();
   if (node.attributes!=null) {
      for (var i=0; i<node.attributes.length; i++) {
         var item = node.attributes.item(i);
         var value = item.nodeValue;
         if (value==null) value = "";
         out += " "+item.nodeName+"=\""+value+"\"";
      }
   }
   out += ">\n";
   for (var i=0; i<node.childNodes.length; i++) {
      var item = node.childNodes.item(i);
      out = nodeToXML(item, indentation+"   ", out);
   }
   if (node.nodeValue!=null) 
      out += indentation+"   "+node.nodeValue+"\n";
   out += indentation+"</"+node.nodeName.toLowerCase()+">\n";
   return out;
}
function show(that) {
   var w = window.open('', 'Popup', '');
   w.document.write('<html><head><title>Document Dump</title>');
   w.document.write('</head><body><pre>');

   var s = nodeToXML(that, '', '');
   s = s.replace(new RegExp('&','g'),'&amp;');
   s = s.replace(new RegExp('<','g'),'&lt;');
   s = s.replace(new RegExp('>','g'),'&gt;');
   w.document.write(s);
   w.document.write('</pre></body></html>');
   w.document.close();
}

function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

engine = {

		location : "./",
		
		random : function (min, max) {
			
			makeFloat = false;
			
			if(typeof min == 'float' || typeof max == 'float') makeFloat = true;
			
			var randVal = min + ( Math.random() * ( max - min ) );
			
			return (makeFloat) ? randVal : Math.round(randVal);
			
		},
			
		
		entries : {
			
			location : "entries",
			
			request : function (from, to) {
				if(!engine.scroll.appending) curpos = engine.scroll.position();
				for (var ri = to; ri >= from; ri--) {
					engine.entries.stack.wait(ri);
					timeout = engine.scroll.appending ? 300*(ri-from) : engine.random(100, 500);
					setTimeout("$.getJSON('"+ engine.location + engine.entries.location + "/" + ri +"', engine.entries.receive)", timeout);
				}
				if(!engine.scroll.appending) curpos = engine.scroll.position(curpos);
			},
			
			receive : function (entry) {
				nr = entry.id;
				
				entry.content = "<![CDATA[" + entry.content + "]]>";
				
				entry.time = engine.entries.formatTime(entry.timestamp);
				entry = engine.entries.render(entry);
				
				engine.entries.stack.push(entry, nr);
			},
			
			render : function (entry) {
				
				//alert(entry.content);

				strXml = toXML(entry);

				//alert(strXml);				
	
				entry = $.parseXML(strXml);

				//$("#example").html(entry);
				
				// internet explorer
				if (window.ActiveXObject)
				{
					entry = entry.transformNode(engine.entries.xslt.content);
				}
				//  Mozilla, Firefox, Opera, etc.
				else if (document.implementation && document.implementation.createDocument)
				{
					try {
						xsltProcessor = new XSLTProcessor();
						xsltProcessor.importStylesheet(engine.entries.xslt.content);
						entry = xsltProcessor.transformToFragment(entry,document);
					}
					catch (err)
					{
						alert(err.message);
					}
				}
				
				return entry;
				//html = $(entry).find(".content").html().replace(/\n/, "<br />");
				
				//$(entry).find(".content").html(html);
				
			},
			
			formatTime : function (time) {
				
				var stime = new Array();
				
				var time = new Date(time*1000);

				h = time.getHours();
				if(h < 10) h = "0"+h;

				m = time.getMinutes();
				if(m < 10) m = "0"+m;

				s = time.getSeconds();
				if(s < 10) s = "0"+s;
				
				return h + ":" + m + ":" + s;
				
			},
			
			init : function  () {
				engine.entries.xslt.init();
			},
			
			xslt : {
				location : "entry.xsl",
				
				content : false,

				download : function () {
					$.get(engine.location + engine.entries.xslt.location, function (xslt) {
						engine.entries.xslt.content = $.parseXML(xslt);
					});
				},
			
				init : function () {
					engine.entries.xslt.download();
				}
			
			},
	
			stack : {
				
				location : "#stack",
				
				resolve_position : function (nr) {
					
					entries = $("#stack .entry");
					
					if(entries.length > 0)
					{
						for(var si = parseInt(nr); si >0; si-- )
						{
							entry = $("#entry"+si);
							if(entry.length) return si;
						}
					}
					
					return false;
				},
				
				wait : function (nr) { 
					
					waiter = "<div class='entry waiter' id='entry"+ nr +"'>Czekam na "+ nr +".</div>";
					
					waiter = $(waiter);
					
					
					position = engine.entries.stack.resolve_position(nr);
					
					if(position) waiter.insertBefore("#entry"+position);
					
					else  $(engine.entries.stack.location).append(waiter);
					
				},
				
				push : function (entry, nr) {
					try {	
						sc = engine.scroll.compute(nr);	
					}
					catch(err)
					{
						sc = false;
					//	alert(err.message);
						$("#dbg").append("<div>"+nr+"</div>");
					}
					finally {
					if(sc) curpos = engine.scroll.position();
					
					//engine.scroll.goTopFlash();
					
					$("#entry"+nr).replaceWith(entry);

					html = $("#entry"+nr+" .content").html().replace(/\n\r?/g, "<br>");
					//alert(html);
					$("#entry"+nr+" .content").html(html);
					
					if(sc) engine.scroll.position(curpos);
					}
					
				}
				
			}
			
		},

		state : {
			
			interval : {
				
				/**
				 * Czas między kolejnymi zapytaniami podawany w milisekundach 1000ms = 1s
				 */
				check : 1000,

				pointer : null
			},
			
			/**
			 * ta zmienna opisuje ile ma zostać załadowanych kolejnych wpisów w kolejności od ostatniego do pierwszego po świerzym załadowaniu strony głównej 
			 * 	ma to na celu zapobierzenie ładowania na raz np 300 kolejnych postów
			 */
			begin_with : 30,
			
			
			location : "counter",

			counter : 0,

			
			check : function () {
				$.get(engine.location + engine.state.location, engine.state.changed);
			},
			
			
			changed : function (current) {
				
				current = parseInt(current);
				
				if(engine.state.counter < current)
				{
					if(engine.state.counter == 0 && current > engine.state.begin_with)
					{
						engine.state.counter = current - engine.state.begin_with;
						
						engine.scroll.from = engine.state.counter;
					}
					engine.scroll.goTopFlash(current - engine.state.counter);
					engine.entries.request(engine.state.counter+1, current);
					engine.state.counter = current;
				}
			},
			
			init : function () {
				engine.state.interval.pointer = setInterval("engine.state.check()", engine.state.interval.check);
			}
			
		},
		
		scroll : {
			
			/**
			 * opisuje po ile postów ma być ładowane podczas skrolowania 
			 * TODO: muszę pomyśleć czy nie powinna być obliczana
			 */
			load_per_scroll : 30,
			
			from : 1,

			append_lock : false,
			
			appending : false,
			
			prevent_safari_auto_scroll : 0,
			
			happend : function () {
				
				moz_bug = ($.browser.mozilla && typeof mod == "undefined") ? 1 : 0;
				
				if(($(document).height() - moz_bug) == ($(window).scrollTop() + $(window).height()) && engine.scroll.from > 1 && !engine.scroll.append_lock)
				{
					engine.scroll.append_lock = true;
					engine.scroll.appending = true;
					
					//engine.scroll.prevent_safari_auto_scroll = engine.scroll.position();
					
					to = engine.scroll.from - engine.scroll.load_per_scroll;
					
					if(to < 1) to = 1;
					
					setTimeout("engine.scroll.load(to, engine.scroll.from-1)", 1);
					
				}
					
				//$("#gotop>div").html(($(document).height() - moz_bug) + " == " + ($(window).scrollTop() + $(window).height())); // $.browser.mozilla
				
				if($(window).scrollTop() == 0)
				{
					$("#new_counter").html("");
					$("#gotop").animate({bottom: -80}, 300, function () {engine.scroll.goTopOnTop=false;});
				}
				else if(!engine.scroll.goTopOnTop)
				{
					$("#gotop").animate({bottom: 0}, 300);
					engine.scroll.goTopOnTop = true;
				}
				
			},
			
			goTopOnTop : false,
			
			load : function (to, from) {
				engine.entries.request(to, from);

				engine.scroll.from = to;
				

				engine.scroll.appending = false;
				
				setTimeout("engine.scroll.append_lock = false;", 100);
			},
			
			lock : false,
			
			triger : function () {
				
				//if(engine.scroll.appending) engine.scroll.position(engine.scroll.prevent_safari_auto_scroll);
				
				if(!engine.scroll.lock)
				{ 
					engine.scroll.lock=true;
					engine.scroll.happend();
					engine.scroll.lock=false;
				}
			},
			
			position : function (gothere) {
				
				
				curpos = $(document).height() - $(window).scrollTop();
				
				
				if(typeof gothere != "undefined" && $(window).scrollTop() != 0 && gothere > 0)
				{
					$(window).scrollTop(curpos - gothere + $(window).scrollTop());
				}
				
				
				return curpos;
				
			},
			
			compute : function (nr) {
				try {
					ob = $("#entry"+nr);
					tp = ob.offset().top;
				}
				catch (err)
				{
					return false;
				}
				
				try {
					scrl = $(window).scrollTop();
				}
				catch (err)
				{
					return false;
				}
				
				try
				{
					hg = $(window).height();
				}catch (err){
					return false;
				}	

				

				return tp < (scrl + hg - (hg/2)); 
			},

			goTop : function () {
				$(window).scrollTop(0);
			},
			
			
			goTopFlash : function (new_ones) {
				if(!engine.scroll.goTopOnTop) return ;
				
				add = parseInt($("#new_counter").html()) ? parseInt($("#new_counter").html()) : 0;
				
				$("#new_counter").html(new_ones + add);
				
				$("#arrowUp").animate({top: -50},300, function () {
					$(this).css({top: 56}).animate({top: 0},300);
				}); 
				
				//alert("asdf");
			},
			
			init : function (from) {
				
				engine.scroll.from = from;
				
				$(window).scroll(engine.scroll.triger);
			}
			
		},
		
		init : function (first) {
			
			engine.entries.init();
			engine.state.init();
			engine.scroll.init();
			
		}


};


/**
 * Inicjalizacja całego silnika serwisu
 */
$(function () { engine.init();});





