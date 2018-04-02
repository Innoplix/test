
function loadToolTipConfig(jSonUrl) {
	$.ajax({url: jSonUrl, success: setToolTip});
}

function setToolTip(d) {
		var data = d; //JSON.parse(d);
		var len = data.tooltips.length;
		var steps = " OUT OF " + data.steps
		var start = new Date().getTime();
		
		for (i=0; i < len; i++) {
				var t = data.tooltips[i];
				var help  = { 
								content: {	
										text: t.help + data.footer,
										title: {
												button : true
										}
								},
								position : {
								},
								hide: { 
									fixed: true,
									delay: 300
								},
								show: {
									solo: true
								},
								style: {
									classes: t.class
								}
							}; 
				if (t.title) 		help.content.title.text = t.title;
				if (t.step) 		help.content.title.text = data.title +": STEP " + t.step + steps;
				if (t.position ) 	help.position.my = t.position;
				if (t.positionAt ) 	help.position.at = t.positionAt;
				
				if (t.step) {
					$(t.selector).qtip(help)
							 .attr("toolTipStep",start+t.step)
							 .bind( "mouseleave blur change", {startObj: start},function(e) {
									var number = parseInt($(e.target).attr("toolTipStep"));
									number++;
									if ( $('[toolTipStep="' + number +'"]').qtip('toggle', true).length == 0) {
										$('[toolTipStep="' + (e.data.startObj + 1 )+'"]').qtip('toggle', true);
									}
							 });
				}
				else {
					$(t.selector).qtip(help)
							 .bind( "mouseleave blur change", {startObj: start},function(e) {
									var number = parseInt($(e.target).attr("toolTipStep"));
									number++;
									if ( $('[toolTipStep="' + number +'"]').qtip('toggle', true).length == 0) {
										$('[toolTipStep="' + (e.data.startObj + 1 )+'"]').qtip('toggle', true);
									}
							 });
				}
				
				
		}
		$('[toolTipStep="' + (start + 1) +'"]').qtip('toggle', true);
	}