/**
 * 
 */
function toXML(obj, d) {
	//obj = this;
	
	if (obj== null) return "";
	
	d = (d) ? d : 0;

	if(d == 0)
	{
		var rString = '<?xml version="1.0" encoding="UTF-8"?>\n<content>';
	}
	else
	{
		var rString = "\n";
	}
	
	var pad = "\t";

	for ( var i = 0; i < d; i++)
	{
		pad += "\t";
	}

	if (typeof obj === "object" && typeof obj.constructor != "undefined") 
	{
		if (obj.constructor.toString().indexOf("Array") !== -1) 
		{
			for (i = 0; i < obj.length; i++) 
			{
				rString += pad + "<item>" + toXML(obj[i], d+ 1 ) + "</item>\n";
			}

			rString = rString.substr(0, rString.length - 1);
		} 
		else 
		{
			for (i in obj)
			{
				if(typeof obj[i] == "undefined") 
				{
					//alert(i);
					continue;
				}
					
				var val = toXML(obj[i], d + 1);

				if (!val) continue;

				rString += ((rString === "\n") ? "" : "\n") + pad + "<" + i
						+ ">" + val
						+ ((typeof obj[i] === "object") ? "\n" + pad : "")
						+ "</" + i + ">";
			}
		}
	}
	else if (typeof obj === "string") 
	{
		//rString = "<![CDATA[" + obj + "]]>";
		
		rString = obj;
	}
	else if (obj.toString) 
	{
		rString = obj.toString();
	} 
	else 
	{
		return false;
	}
	
	if(d == 0)
	{
		rString += '\n</content>';
	}
	
	return rString;
};

//*/


//*/