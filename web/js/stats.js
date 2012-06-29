/**
 * 
 */

stats = {
		
		interval : null,
		
		link_nginx : null,
		
		link_stats : null,
		
		sort_order : "ram",
		
		ram : 256,

		ram_shown : 2024,		

		fetch : function ()
		{
			$.getJSON(stats.link_server, function (o) {
				stats.refresh_stats(o);
			});
			
			$.get(stats.link_nginx, function (o) {
				stats.refresh_nginx(o);
			});
		},
		
		refresh_nginx : function (o) 
		{
			$("#nginx pre").html(o);
		},
		
		refresh_stats : function (jstats)
		{

			$("#cpu").html(jstats.cpu + "%");
			$("#ram").html(jstats.ram + "% " + Math.round(jstats.ram * stats.ram / 100)+"/"+stats.ram+" MB");

			$("#traffic_in").html(jstats.net.rx.rate + " " + jstats.net.rx.unit + "&nbsp;&nbsp;&nbsp;" + jstats.net.rx.packets + " packets");
			$("#traffic_out").html(jstats.net.tx.rate + " " + jstats.net.tx.unit + "&nbsp;&nbsp;&nbsp;" + jstats.net.tx.packets + " packets");
			
			$("#procesy>table>tbody>tr").remove();
			
			if(stats.sort_order == "cpu")
			{
				jstats.procesy.sort(stats.sort_by_cpu);
			}
			else
			{
				jstats.procesy.sort(stats.sort_by_ram);
			}
			
			for (i in jstats.procesy)
			{
				$("#procesy>table>tbody").prepend("<tr><td>" + jstats.procesy[i].cpu +"%</td><td>"+ jstats.procesy[i].ram +"%</td><td>"+ jstats.procesy[i].proces  +"</td></tr>");
			}
			//maxSpeed.sort(SortByVelocity);
		},
		
		sort_by_cpu : function (a,b) 
		{
			 return a.cpu - b.cpu;
		},
		
		sort_by_ram : function (a,b) 
		{
			 return a.ram - b.ram;
		},
		
		init : function ()
		{
			stats.interval = setInterval("stats.fetch()", 1000);
			
		//	stats.init_sorters();

			//setTimeout("clearInterval(stats.interval)", 10000);

			//i$("#")
			
		}
}


$(function (){ stats.init();});
