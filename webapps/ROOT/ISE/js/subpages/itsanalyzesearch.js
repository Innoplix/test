var itsanalyzesearch = {	
		viewres:[],
		contentarray:{},
		cnt:0,
		cnt1:1,
		cnt2:0,
		prevtitle:{},
     /* Init function  */
      init: function(){
	  ITS._GetViewList("configuration",itsanalyzesearch._GetViewCollection);
	  },
	  
	_GetViewCollection:function (responseText) {
		viewres = responseText;
		var viewlist = [];
		$("#viewdrp").html('');
		var drpOption = '';
		var data = responseText.hits.hits;
		var doc_ids = [];
		var source = null;
		if (data.length > 0) {
			for (var i = 0; i <= data.length; i++) {
			   if (i == 0) {
					drpOption += '<option value="0" selected>Select View</option>';
				}
				else {
					drpOption += '<option value="' + data[i - 1]._id + '">' + data[i - 1]._id + '</option>';
				}

			}
		}
		else
		{
			drpOption += '<option value="0" selected>No View</option>';
		}
		$("#viewdrp").html(drpOption);
	},
	
	_SearchViewText:function() {
		var SelView = document.getElementById('viewdrp').value;
		var Searchtxt = document.getElementById('txtAnalyze').value;
		if (SelView != 0 && Searchtxt != "") {
			$('#dvmsgforwait').html("");       
			itsanalyzesearch._OnSearchViewText();
		}
		else {
			document.getElementById('dvmsgforwait').style.color = "maroon";
			$('#dvmsgforwait').html("Please select view and enter your query...");
		}
	},
	
	 _OnSearchViewText:function() {
			var SelView = document.getElementById('viewdrp').value;
			var Searchtxt = document.getElementById('txtAnalyze').value;
			var data = viewres.hits.hits;
			var col;
			var label;
			var resSize=10;
			for (var i = 0; i < data.length; i++) {
				if (data[i]._id == SelView) {
					col = data[i]._source.query.Collection;
					label=data[i]._source.query.Label;
					break;
				}
			}			

			var chklist = new Array;
			for (var i = 0; i < col.length; i++) {				
					chklist.push(col[i]);
				
			}
			
			var res = itsanalyzesearch._SearchMultiIndicesForText(Searchtxt,chklist,label,resSize);
			if (res == 1) {

				if (format == "0") {
					document.getElementById('dvresview').style.display = "none";
					document.getElementById('tt').style.display = "block";
				  }
				else {
					document.getElementById('dvresview').style.display = "block";
					document.getElementById('tt').style.display = "none";
				}
			}
		},
		
		_SearchMultiIndicesForText:function(Searchtxt, collectioname,label,resSize) {
		 
			itsanalyzesearch.cnt = collectioname.length;
			itsanalyzesearch.cnt1=1;
		    for (var i = 0; i <= collectioname.length; i++) {		
				//if(itsanalyzesearch.cnt2==itsanalyzesearch.cnt1)
					//{
					var requestObject = new Object();
					requestObject.collectionName = collectioname[i - 1];
					requestObject.searchString = Searchtxt;					
					requestObject.maxResults = resSize;
					requestObject.analyzer="cess_analyzer";
					requestObject.label=label[i - 1];
					ITS._GetResultSearch(requestObject,itsanalyzesearch._SearchResponse);
					//}				
			}
					 
		 },
		 
		_AddTab:function(contentarray)
		{
		_.each(contentarray, function (val, key) {
        var title = key;
		
		if (itsanalyzesearch.prevtitle != title) {
				var tab = $('#tt').tabs('getTab', title);  // get selected panel

                var dv = "<div id='dv-" + title + "'><br/>" + val + "</div>"
                $('#tt').tabs('update', {
                    tab: tab,
                    options: {
                        title: title,
                        content: dv  // the new content URL
                    }
                });
		
            if ($('#tt').tabs('exists', title)) {
                var tab = $('#tt').tabs('getTab', title);  // get selected panel

                var dv = "<div id='dv-" + title + "'><br/>" + val + "</div>"
                $('#tt').tabs('update', {
                    tab: tab,
                    options: {
                        title: title,
                        content: dv  // the new content URL
                    }
                });

            } else {
                if (i == 0) {

                    var dv = "<div id='dv-" + title + "'><br/>" + val + "</div>"
                    $('#tt').tabs('add', {
                        title: title,
                        content: dv,
                        iconCls: 'icon-add'

                    });
                }
                else {

                    var dv = "<div id='dv-" + title + "'><br/>" + val + "</div>"
                    $('#tt').tabs('add', {
                        title: title,
                        content: dv,
                        iconCls: 'icon-add'

                    });

                }
            }
        }
        else {
            $('#tt').tabs('select', title);
        }

        itsanalyzesearch.prevtitle = title;
		// tabAutorResize($('#tt').tabs('getTab', title));
    });

    document.getElementById('trMultiView').style.display = "block";
	},
		
	_SearchResponse:function (dataObj) {
		
		var Id="dv-" + dataObj[1]._index;
		$('#' + Id + '').html('');
		//var valhtml2="";
		if (dataObj.length > 0) {
			var valhtml = '<table class="resultTable">';
			for (var i = 0; i < dataObj.length; i++) 
			{
			     valhtml+='<tr>';
				 var l=0;
				_.each(dataObj[i], function (val, key) {
						if(l>2)
						{
						valhtml += '<td>'+key+': </td><td>'+val+'</td>';
						
						}
						l++;
						
				});
				valhtml+='</tr>';
				
			}
				
			
			
			//for (var i = 0; i < dataObj.length; i++) {
			//	valhtml += '<tr><td>'+dataObj[i+3]+'</td></tr>';
			//}
			
			valhtml += '</table>';
		}
		else {
			valhtml = "<span style='font-size:12px;'> Result Not Found</span>";
		}
		
		$('#' + Id + '').html(valhtml);
		itsanalyzesearch.contentarray[dataObj[0]._cnt]=valhtml;
		
		Object.size = function (obj) {
                var size = 0, key;
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) size++;
                }
                return size;
        };

        // Get the size of an object
        var size = Object.size(itsanalyzesearch.contentarray);
		if (size == 5) {
            itsanalyzesearch._AddTab(itsanalyzesearch.contentarray);
        }	
		itsanalyzesearch.cnt1++;	
	}
}