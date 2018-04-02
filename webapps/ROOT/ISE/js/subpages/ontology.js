var ontology = {
	json1:{},
	methodDefectCnt:[],
	obj1:{},
	oldjsonData :{},
	node1:'',
	sys:'',
	projectName : localStorage.getItem('projectName'),
	size :1,
	type:'',
	list: {},
	colorlist: {},
	collectionlist:{},
	estype:{},
	nodetype: {},
	parenttobeshown:'',
	searchString:'',
	parentnotAvail:'',
  //parentlist:[],
		 //json:{},
init: function() {
	ontology.colorlist["defect"] = "#ff9999"
	ontology.colorlist["sourcecode"] = "#99ff66"
	ontology.colorlist["primary_feature"] = "#66ffcc"
	ontology.colorlist["testcase"] = "#ffcc66"
	ontology.colorlist["fixedengineer"] = "#ffff66"
	ontology.colorlist["reportedengineer"] = "#ffff99"
	ontology.collectionlist["#ff9999"] = "defect"
	ontology.collectionlist["#e6ff99"] = "deploymenttype"
	ontology.collectionlist["#66ffcc"] = "primary_feature"
	ontology.collectionlist["#99ff66"] = "sourcecode"
	ontology.collectionlist["#ffcc66"] = "testcase"
	ontology.collectionlist["#ffff66"] = "fixedengineer"
	ontology.collectionlist["#ffff99"] = "reportedengineer"
	ontology.colorlist["deploymenttype"] = "#e6ff99"
	$.getJSON("json/Ontology.json?", function(data) {
		ontology.json1 = data
		
		console.log("ontology.json1=============================="+JSON.stringify(ontology.json1["defects"]));
	});
	var requestObject = new Object();
	requestObject.collectionName = "defect_collection";
	requestObject.projectName = localStorage.getItem('projectName')
	requestObject.maxResults = 1
	requestObject.filterString = ''
	requestObject.serachType = "similarSearch";
	ontology.type = "defect"
	ontology.nodetype = "deployment\\ type"
	ontology.estype = "aggregation"
	ontology.callGetSearch(requestObject,null,"","","getTotalDefectsResults");

},
old:{},
createOntalogy: function(enityObj,esdata) {
// ontology.list = {};

ontology.obj1 = {};
ontology.obj1 = enityObj;
ontology.esres = esdata;
var color12;

//alert(enityObj["shape"]);
$.each( enityObj, function( key1, value1 ) 
{
	var shape12 = "dot"
	if(key1 == "entity"  )
	{
	  color12 = ontology.colorlist[enityObj.entity];
	  shape12 = "dot"
	}

	if(key1 != "entity" ) 
	{
		if(value1.indexOf("defect") > -1 || value1.indexOf("buglist") > -1 || key1.indexOf("defect") > -1)
		{
			color12 = ontology.colorlist["defect"];
			shape12 = "dot"
		}
		 if(value1.indexOf("testcase") > -1 || key1.indexOf("testcase") > -1 )
		{
			color12 = ontology.colorlist["testcase"];
			shape12 = "dot"
		}
		 if(value1.indexOf("deployment\\ type") > -1 || key1.indexOf("deployment\\ type") > -1 )
		{
			color12 = ontology.colorlist["deploymenttype"];
			shape12 = "rect"
		}
		 if(value1.indexOf("sourcecode") > -1 || key1.indexOf("sourcecode") > -1)
		{
			color12 = ontology.colorlist["sourcecode"];
			shape12 = "rect"
		}
		 if(value1.indexOf("primary_feature") > -1 || key1.indexOf("primary_feature") > -1)
		{
			color12 = ontology.colorlist["primary_feature"] 
			shape12 = "rect"
		}
		 if(value1.indexOf("internalcount") > -1 || value1.indexOf("externalcount") > -1 || value1.indexOf("bugList") > -1 )
		{
			color12 = ontology.colorlist["defect"];
			shape12 = "dot"
		}
		if(key1.indexOf("reporter") > -1)
		{
			color12 = ontology.colorlist["reportedengineer"];
			shape12 = "dot"
		}
		if(key1.indexOf("resolvedby") > -1)
		{
			color12 = ontology.colorlist["fixedengineer"];
			shape12 = "dot"
		}
		
		for(key in ontology.list)
		  {
				if(ontology.list[key].indexOf(value1) > -1 )
				{
					color12 = key;
				}
		  }
		//alert(ontology.colorlist[enityObj])
		
		if(ontology.list.hasOwnProperty(color12))
		{
		var list = ontology.list[color12] 
		if(list.indexOf(value1) == -1 && value1 != "defectslist")
		list.push(value1);
		 ontology.list[color12]  = list;
		}
		else
		{
			var list = [];
			if(value1 != "defectslist")
			{
			list.push(value1);
			}
			ontology.list[color12] = list
		}
		
		//console.log("================="+ontology.sys.getNode(value1));
		if(ontology.parentnode != '' && ontology.parentnode != undefined)
		{
		ontology.sys.addNode(value1, { 'color':color12 , 'shape': shape12, 'label': value1, 'alpha': 1, 'use': 'main','parent':enityObj[enityObj.entity],'type':key1,"nodetype": enityObj.entity,"collection":ontology.type,'parentnode':ontology.parentnode});
		}
		else
		{
			ontology.sys.addNode(value1, { 'color':color12 , 'shape': shape12, 'label': value1, 'alpha': 1, 'use': 'main','parent':enityObj[enityObj.entity],'type':key1,"nodetype": enityObj.entity,"collection":ontology.type,'parentnode':enityObj[enityObj.entity]});
		}
	
		
	}

  });

	$.each( enityObj, function( key, value ) {
		if(key != "entity" )// || value != enityObj[key])
		ontology.sys.addEdge(enityObj[enityObj.entity], value,{directed:true});
	});
	ontology.formEdges();
},
DisplaySelectedNode: function(selectedNode) {

$.each( ontology.obj1, function( key, value ) {

	if((key != "entity" &&   value != selectedNode.node.data.parent && value.trim() != (selectedNode.node.name).trim()) )
	{
		setTimeout(function () {
		ontology.sys.pruneNode(value);
		}, 500);
		for(key in ontology.list)
		{
			if(ontology.list[key].indexOf(value) > -1)
			{
			ontology.list[key].splice(ontology.list[key].indexOf(value), 1);
			}
		}
	}
	else if(value == selectedNode.node.name &&  selectedNode.node.name.indexOf(" ##") > -1 && ontology.parenttobeshown != "yes")
	{
		setTimeout(function () {
		ontology.sys.pruneNode(value);
		}, 500);
		ontology.parentnotAvail = "yes"
		for(key in ontology.list)
		{
			if(ontology.list[key].indexOf(value) > -1)
			{
			ontology.list[key].splice(ontology.list[key].indexOf(value), 1);
			}
		}
	}

	});	
	ontology.remove(selected,ontology.obj1,ontology.esres);

},
parentnode:'',
callGetSearch: function(requestObject,oldjson,node,nodename,method,esdata)
{
ontology.parentnode = '';
	ontology.oldjsonData = {};
	ontology.oldjsonData = oldjson;
	ontology.node1 = "";
	ontology.node1= node
	
	/* if(ontology.nodename != null && ontology.nodename != undefined &&  ontology.nodename.indexOf("primary_feature") > -1)
	{
		ontology.getFeatureResults(requestObject,ontology.getres);
	} */
	 if(method == "getTotalDefectsResults" || ontology.selectednode1.node.name == "defectslist")
	{
		$("#div_Defects").empty();
		var canvas = document.getElementById('div_Defects');

		var newCanvas = document.createElement('canvas');
		newCanvas.width = "800";
		newCanvas.height = "400";
		newCanvas.id = "viewport";
		canvas.appendChild(newCanvas);
		ontology.sys = arbor.ParticleSystem();
		ontology.sys.parameters({ gravity: true });
		ontology.sys.parameters({ stiffness: 900, repulsion: 2000, gravity: true, dt: 0.015 })
		ontology.sys.renderer = Renderer("#viewport");
		Renderer("#viewport");
		ontology.list = {};
		ontology.oldjsonData = null;
		var requestObject = new Object();
	requestObject.collectionName = "defect_collection";
	requestObject.projectName = localStorage.getItem('projectName')
	requestObject.maxResults = 1
	requestObject.filterString = ''
	requestObject.serachType = "similarSearch";
	ontology.type = "defect"
	ontology.nodetype = "deployment\\ type"
	ontology.estype = "aggregation"
	//ontology.callGetSearch(requestObject,null,"","","getTotalDefectsResults");
		ontology.getTotalDefectsResults(requestObject,ontology.getres);
	}
	
	else if(ontology.selectednode1.node.data.type.indexOf("deployment\\ type") > -1 )
	{
	ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		requestObject.searchString = "deployment\\ type" + ":\""+splitvar[0].replace(/ /g,"\\ ")+"\""
		ontology.searchString = requestObject.searchString
		requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection";
		requestObject.projectName = ontology.projectName
		ontology.estype = "similarsearch"
		ontology.type = "defect"
		ontology.collection = "defect_collection"
		ontology.estype= "aggregation"
		ontology.nodetype= "primary_feature"
		ontology.getDeploymentFeatureResults(requestObject,ontology.getres);
		
	}
	else if(ontology.selectednode1.node.data.type.indexOf("primary_featurecount" ) > -1)
	{
	ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		var parentnode = ontology.selectednode1.node.data.parentnode.split(" ##")
		var parentnodetype = (ontology.sys.getNode((ontology.sys.getNode(ontology.selectednode1.node.name)).data.parentnode)).data.type;
		ontology.parentnode = ontology.selectednode1.node.data.parentnode;
		requestObject.searchString = "primary_feature" + ":\""+splitvar[0].replace(/ /g,"\\ ")+"\" AND "+"deployment\\ type"+":\""+parentnode[0]+"\"";
		ontology.searchString = requestObject.searchString
		requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection";
		requestObject.projectName = ontology.projectName
		ontology.estype = "aggregation"
		ontology.type = "defect"
		ontology.collection = "defect_collection"
		ontology.nodetype= "resolvedby"
		ontology.getFixedEngineerResults(requestObject,ontology.getres);
		
	}
	else if(ontology.selectednode1.node.data.type.indexOf("resolvedbycount" ) > -1)
	{
	
	ontology.parentnode = ontology.selectednode1.node.data.parentnode;
	ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		var parentnode = ontology.selectednode1.node.data.parent.split(" ##")
		var parentnodetype1 = ontology.sys.getNode(ontology.selectednode1.node.data.parentnode).data.parentnode.split(" ##");
		//var parentnodetype2 = (ontology.sys.getNode((parentnodetype1[0]).data.parentnode).split("count");
		requestObject.searchString = "deployment\\ type:\""+parentnodetype1[0]+ "\" AND primary_feature: \""+parentnode[0]+"\" AND resolvedby"+":\""+splitvar[0].replace(/ /g,"\\ ")+"\""
		ontology.searchString = requestObject.searchString
		requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection";
		requestObject.projectName = ontology.projectName
		ontology.estype = "similarsearch"
		ontology.type = "defect"
		ontology.collection = "defect_collection"
		ontology.nodetype= "defect"
		ontology.getSearchResults(requestObject,ontology.getres);
		
	}
	else if(ontology.selectednode1.node.data.type.indexOf("defect") > -1)
	{
	ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		
		requestObject.searchString = "_id:"+ontology.selectednode1.node.name;
		ontology.searchString = requestObject.searchString
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection";
		requestObject.projectName = ontology.projectName;
		requestObject.size =1;
		ontology.estype = "similarsearch"
		ontology.type = "defect"
		ontology.collection = "defect_collection"
		ontology.nodetype= "defect"
		ontology.getSearchResults(requestObject,ontology.getres);
		
	}
	else if(ontology.nodename != null && ontology.nodename != undefined &&  ontology.nodename.indexOf("primary_feature") > -1)
	{
	ontology.parenttobeshown = "no"
		var requestObject = new Object();
		requestObject.searchString = "primary_feature:\""+ontology.selectednode1.node.name+"\"";
		ontology.searchString = requestObject.searchString
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection,testcase_collection,sourcecode_collection";
		requestObject.projectName = ontology.projectName;
		requestObject.size =0;
		ontology.estype = "aggregation"
		ontology.type = "collection"
		ontology.collection = "defect_collection,testcase_collection,sourcecode_collection"
		ontology.nodetype= "collection"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getFeatureResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.name != null && ontology.selectednode1.node.name != undefined &&  ontology.selectednode1.node.name.indexOf("defect ##") > -1)
	{
	
		ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		//ontology.searchString = requestObject.searchString
		requestObject.searchString = "primary_feature:\""+ontology.selectednode1.node.data.parent+"\"";
		//requestObject.type = ontology.selectednode1.node.data.collection;
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "defect_collection"
		requestObject.projectName = ontology.projectName;
		requestObject.size = 10;
		ontology.estype = "similarsearch"
		ontology.type = "defect"
		ontology.collection = "defect_collection"
		ontology.nodetype= "defect"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getSearchResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.name != null && ontology.selectednode1.node.name != undefined &&  ontology.selectednode1.node.name.indexOf("testcase ##") > -1)
	{
	
		ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		//ontology.searchString = requestObject.searchString
		requestObject.searchString = "primary_feature:\""+ontology.selectednode1.node.data.parent+"\"";
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "testcase_collection"
		requestObject.projectName = ontology.projectName;
		requestObject.size = 10;
		ontology.estype = "similarsearch"
		ontology.type = "testcase"
		ontology.collection = "testcase_collection";
		ontology.nodetype= "testcase"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getSearchResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.data.type.indexOf("sourcecodecount") >  -1)
	{
		
		ontology.estype = "aggregation"
		ontology.type = "sourcecode"
		ontology.collection = "sourcecode"
		ontology.nodetype= "sourcecode"
		ontology.loadJson(esdata);
		//ontology.getSearchResults(requestObject,ontology.getres);
		//ontology.getFeatureResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.name != null && ontology.selectednode1.node.name != undefined &&  ontology.selectednode1.node.name.indexOf("sourcecode ##") > -1)
	{
		ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		//ontology.searchString = requestObject.searchString
		requestObject.searchString = "primary_feature:\""+ontology.selectednode1.node.data.parent+"\"";
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "sourcecode_collection";
		requestObject.projectName = ontology.projectName;
		requestObject.size = 10;
		ontology.estype = "aggregation"
		ontology.type = "sourcecode"
		ontology.collection = "sourcecode_collection"
		ontology.nodetype= "sourcecode"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getFeatureResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.data.type.indexOf("testcase")  > -1)
	{
		ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		//ontology.searchString = requestObject.searchString
		requestObject.searchString = "_id:"+ontology.selectednode1.node.name;
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "testcase_collection"
		requestObject.projectName = ontology.projectName;
		requestObject.size = 1;
		ontology.estype = "similarsearch"
		ontology.type = "testcase"
		ontology.collection = "testcase_collection"
		ontology.nodetype= "testcase"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getSearchResults(requestObject,ontology.getres);
	}
	else if(ontology.selectednode1.node.data.type.indexOf("sourcecode") >  -1)
	{
		ontology.parenttobeshown = "yes"
		var requestObject = new Object();
		var splitvar = ontology.selectednode1.node.name.split(" ##");
		//ontology.searchString = requestObject.searchString
		requestObject.searchString = "files:\""+ontology.selectednode1.node.name+"\"";
		//requestObject.type = ontology.selectednode1.node.data.collection;
		requestObject.collectionName = "sourcecode_collection"
		requestObject.projectName = ontology.projectName;
		requestObject.size = 1;
		ontology.estype = "similarsearch"
		ontology.type = "sourcecode"
		ontology.collection = "sourcecode_collection"
		ontology.nodetype= "sourcecode"
		//ontology.getSearchResults(requestObject,ontology.getres);
		ontology.getSearchResults(requestObject,ontology.getres);
	}
	else 
	{
		ontology.getSearchResults(requestObject,ontology.getres);
	}
},

getres: function(data)
{
	console.log("data"+JSON.stringify(data));
	ontology.loadJson(data);

},
	//width: 100px; height: 100px; background: red; -moz-border-radius: 50px; -webkit-border-radius: 50px; border-radius: 50px;
formEdges: function()
{
	$("#append").empty();
	var html = "<table>"
	for(key in ontology.list)
	{
		if(ontology.list[key] != null && ontology.list[key] !=undefined &&  ontology.list[key].length > 0)
		{
			html = html +"<tr><td><div style='width:10px; padding-left: 10px; height: 10px; background: "+key+"; -moz-border-radius: 50px; -webkit-border-radius: 50px; border-radius: 50px'></div><div style='margin-top: -15px;padding-left: 15px; font-weight: bold; font-size:small;font-family:verdana;'>"+ontology.collectionlist[key]+"</div></td></tr>" 

			for(var i=0; i<ontology.list[key].length; i++)
			{
				html= html+"<tr><td><label style='font-family:cursive;font-size:12px;padding-left:15px'>"+ontology.list[key][i]+"</tr></td>"
			}
		}
	}
	html= html+"</table></div>"

	$("#append").append(html)

},

loadJson: function(esdata)
{
//var parentnode;
var json = {};
	if(ontology.estype == "aggregation")
	{
		
		if(ontology.nodetype == "deployment\\ type" )
		{
			json.entity = ontology.nodetype
			ontology.parenttobeshown = "yes"
			json[ontology.nodetype] = "defectslist";
			for(var i=0; i<esdata.length;i++)
			{
				json[ontology.nodetype+"count"+i] = esdata[i].key+" ##"+(esdata[i].doc_count).toString();
			}
		}
		else if(ontology.selectednode1.node.data.type.indexOf("sourcecodecount") > -1)
		{
		
				json["sourcecodecount"] = ontology.selectednode1.node.name;
				json.entity = "sourcecodecount";
				 var splitvar = 	esdata[0]["file"].replace("[","").	replace("]","").split(",")
				//var data  =  esdata[0].files
				for(var es=0;es<splitvar.length;es++ )
				{
					if(es == 10)
					{
						break;
					}
					json["sourcecode"+es] = splitvar[es].trim();
				}	
		}
		else if(ontology.selectednode1.node.name.indexOf("sourcecode ##") > -1)
		{
		
				json["primary_feature"] = ontology.selectednode1.node.data.parent
				json.entity = "primary_feature";
				var data  =  esdata[0].files
				for(var es=0;es<data.length;es++ )
				{
					if(es == 10)
					{
						break;
					}
					json[ontology.nodetype+es] = data[es].key;
				}	
		}
		else
		{
			json.entity = ontology.selectednode1.node.data.type;
			json[json.entity] = ontology.selectednode1.node.name;
			for(var i=0; i<esdata.length;i++)
			{
				json[ontology.nodetype+"count"+i] = esdata[i].key.split("_collection")[0]+" ##"+(esdata[i].doc_count).toString();
			}
			
		}
		
	}
	else if(ontology.estype == "similarsearch")
	{
		 if(ontology.selectednode1.node.name.indexOf("count") > -1 || ontology.selectednode1.node.name.indexOf(" ##") > -1)
		 {
			json.entity = ontology.selectednode1.node.data.type
			json[json.entity] = ontology.selectednode1.node.name;
			if(ontology.parentnotAvail == "yes")
			{
				json[json.entity] = ontology.selectednode1.node.data.parent;
			}
			
			for(var i=0; i<esdata.length;i++)
			{
				json[ontology.nodetype+i] = esdata[i]._id;
				if(esdata[0].index == "sourcecode_collection" )
				{
					json[ontology.nodetype+i] = esdata[i].files;
				}
			}
		 }
		 else
		 {
			 $.each(ontology.json1[ontology.type], function(key, val) {
			 json.entity = ontology.type
				json[ontology.type] = esdata[0][val[0].parent]
				
				 for(var es=0;es<esdata.length;es++ )
				 {
					for(var i=0;i<val.length;i++ )
					{
						
						var valn = val[i].name;
						
						 if(esdata[0][val[i].name] != undefined && esdata[0][val[i].name] != 'undefined')
						 {
							
								if(val[i].type == "string")
								{
								json[val[i].name] = esdata[0][val[i].name]
								}
								else if(val[i].name == "file")
								{
								 var splitvar = 	esdata[0][val[i].name].replace("[","").	replace("]","").split(",")
								 json["sourcecodecount"] = (splitvar.length).toString();
								
								}
						 }
					}
				
				}
			 
			 });
			  }
			
		 }
		 console.log(json);
		 setTimeout(function () {
		ontology.createOntalogy(json,esdata);
		}, 800)
	
	},
	
	


 nodename : '',
 selectednode1:'',
remove: function(selectednode,json,esdata)
{
ontology.type  = ""
	ontology.selectednode1 = {};
	ontology.selectednode1 = selectednode
	ontology.nodename = '';
	var collectionName  = "";
	ontology.nodename = selectednode.node.data.type
	var node = selectednode.node.name
	var requestObject =  new Object();
	ontology.callGetSearch(requestObject,json,node,ontology.nodename,"",esdata);

			
},

 getSearchResults: function(requestObject,callBackFunction) {

      if(!requestObject) {
        callBackFunction(null); 
        return;
      }
    
    var sString = requestObject.title+" "+requestObject.searchString;
    //var wordlist = requestObject.searchString.trim().split(/[^a-zA-Z0-9]+/);
	var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
    var ulist = {};
    for (var i = 0; i < wordlist.length ; i++) {
    ulist[wordlist[i].toUpperCase()] = 1;
    }
    
    //ISE.lastSearchTermCount = Object.keys(ulist).length;
    
    
    
    
      //need to write other error checks
      var masterBucket = new Array();
        var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

         
            client.search({
              index: requestObject.collectionName,
              type:requestObject.projectName,
              size: requestObject.maxResults, //15
              body: {
                "_source": {
        "exclude": [ "documentcontent" ]
    },
                "highlight": {
                // "require_field_match": true,
                  "number_of_fragments" : 0,
                  "pre_tags" : ["<em class='iseH'>"],
                  "post_tags" : ["</em>"],
                                                                  "encoder" : "html",
                  
                  "fields": {

                    //"no_match_size": 150},
            "description": {},
            "title":{},
                  
                  }
                  },
                "query":  ontology.getQuery(requestObject)
                   //]
                  
               // }

             //}
               
             }
             
            }).then(function (resp) {
              //console.log( resp);
              var temp = resp.hits;
              //console.log("temp"+temp);
              var tempAry = temp.hits;
              //console.log(tempAry[i].getHighlightFields())
        masterBucket = [];
              for(var i = 0;i< tempAry.length;i++){

                if(tempAry[i]._source !='undefined' && tempAry[i]._source != null && tempAry[i]._source != 'null'){
                 
                  masterBucket[i] = tempAry[i]._source;
                  masterBucket[i].index = tempAry[i]._index;
                  if( tempAry[i].highlight !='undefined') {
                   //SIMY: TODO .. there is some issue here 
                      for(var K in tempAry[i].highlight){
                            masterBucket[i][K] = tempAry[i].highlight[K][0].replace(/\n/g,"<br/>");
                      }
          
                     
                  }

                }else if(tempAry[i].source !='undefined' && tempAry[i].source != null && tempAry[i].source != 'null'){
                  masterBucket[i] = tempAry[i].source;
          //._score
                }
                
              }              
              // var masterBucket=ISE.setSimilarity(masterBucket,tempAry);    
               
             // datArr = processDefectsDataObject_ElasticSearch(masterBucket,tempAry);
              callBackFunction(masterBucket);
            },function (error) {console.log(error);callBackFunction([])} );
  },
   getFeatureResults: function(requestObject,callBackFunction) {

	if(!requestObject) {
	callBackFunction(null); 
	return;
	}
    var sString = requestObject.title+" "+requestObject.searchString;
	var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
    var ulist = {};
    for (var i = 0; i < wordlist.length ; i++) {
		ulist[wordlist[i].toUpperCase()] = 1;
    }
  
    var masterBucket = new Array();
    var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});
    client.search({
	index: requestObject.collectionName,
	type:requestObject.projectName,
	size: 0, //15
	body: {
	"query" : {
      "filtered" : { 
        "query" : {
            "query_string" : {
				"query" : requestObject.searchString
							}
					}
				}
    },"aggregations": {
                "_index":{
                    "terms":{ "field": "_index","size":0 },"aggregations": {
                "files":{
                    "terms":{ "field": "files","size":0 }
							} 
						}
					}
                
					}
				}
            }).then(function (resp) {
			  var temp = resp.aggregations;           
              var tempAry = temp._index.buckets;              
              masterBucket=[];            

              for(var i = 0;i< tempAry.length;i++){              
				if(tempAry[i].key == "sourcecode_collection" )
				{
							var eachobj = new Object();
							eachobj.doc_count  =  tempAry[i].files.buckets.length
							eachobj.key  =  tempAry[i].key
							eachobj.files = tempAry[i].files.buckets;
							masterBucket[i] = eachobj;
				}	
				else
				{
					masterBucket[i] = tempAry[i]; 
				}				
                                 
                }       
              console.log(masterBucket);
              callBackFunction(masterBucket);
        
            },function (error) {console.log(error);callBackFunction([])} );
            
  },
getEngineerResults: function(requestObject,callBackFunction) {

if(!requestObject) {
callBackFunction(null); 
return;
}

var sString = requestObject.title+" "+requestObject.searchString;
//var wordlist = requestObject.searchString.trim().split(/[^a-zA-Z0-9]+/);
var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
var ulist = {};
for (var i = 0; i < wordlist.length ; i++) {
	ulist[wordlist[i].toUpperCase()] = 1;
}

var masterBucket = new Array();
var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});


client.search({
index: requestObject.collectionName,
type:requestObject.projectName,
size: 0, //15
body: {

"aggregations": {
"reporter": {"terms": {"field": "reporter"}},
"resolvedBy": {"terms": {"field": "resolvedby"}},
"fixedBy": {"terms": {"field": "fixedby"}}
},
"query" : {
"filtered" : { 
"query" : {
"query_string" : {
"query" :requestObject.searchString,"analyzer": "cess_analyzer" 
				}
			}
		  }
		}
	}

	}).then(function (resp) 
	{
	console.log("resp"+resp)
	var temp = resp.aggregations;   
	console.log("resp"+temp)			
	var fixedby = temp.fixedBy.buckets;  
	var reportedby = 	temp.reporter.buckets;
	var resolvedby = 	temp.resolvedBy.buckets;
	masterBucket=[];  
	for(var i = 0;i< fixedby.length;i++){
		if(fixedby[i].key == ontology.selectednode1.node.name)
		{	
			var eachobj = new Object();					
			eachobj.key = "sourcecodefixed";   
			eachobj.count = fixedby[i].doc_count;   	
			masterBucket.push(eachobj);
			break;
		}
	}
	for(var i = 0;i< reportedby.length;i++)
	{
		if(reportedby[i].key == ontology.selectednode1.node.name)
		{	
			var eachobj = new Object();					
			eachobj.key = "defectsreported";   
			eachobj.count = reportedby[i].doc_count;   	
			masterBucket.push(eachobj);
			break;
		}
	}
	for(var i = 0;i< resolvedby.length;i++)
	{
		if(resolvedby[i].key == ontology.selectednode1.node.name)
		{	
			var eachobj = new Object();					
			eachobj.key = "defectsresolved";   
			eachobj.count = resolvedby[i].doc_count;   	
			masterBucket.push(eachobj);
			break;
		}
	}
	console.log(masterBucket+"masterBucket");
	callBackFunction(masterBucket);

},function (error) {console.log(error);callBackFunction([])} );
},
getTotalDefectsResults: function(requestObject,callBackFunction) {
	if(!requestObject) {
	callBackFunction(null); 
	return;
	}
	var sString = requestObject.title+" "+requestObject.searchString;
	//var wordlist = requestObject.searchString.trim().split(/[^a-zA-Z0-9]+/);
	var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
	var ulist = {};
	for (var i = 0; i < wordlist.length ; i++) {
		ulist[wordlist[i].toUpperCase()] = 1;
	}
	var masterBucket = new Array();
	var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

	client.search({
	index: requestObject.collectionName,
	type:requestObject.projectName,
	size: 0, //15
	body: 
	{
    	"query" : {
		"filtered" : { 
		"query": {
		"match_all": {}
		}
		}
		},"aggregations": {
		"files":{
		"terms":{ "field": "deployment type","size":0 }
		}


		}
	}
	
	}).then(function (resp) {var temp = resp.aggregations;           
	var tempAry = temp.files.buckets;              
	masterBucket=[];            

	for(var i = 0;i< tempAry.length;i++){              

	masterBucket[i] = tempAry[i];               

	}               

console.log(masterBucket);
callBackFunction(masterBucket);

},function (error) {console.log(error);callBackFunction([])} );
},
getDeploymentFeatureResults: function(requestObject,callBackFunction) {
	if(!requestObject) {
	callBackFunction(null); 
	return;
	}
	var sString = requestObject.title+" "+requestObject.searchString;
	//var wordlist = requestObject.searchString.trim().split(/[^a-zA-Z0-9]+/);
	var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
	var ulist = {};
	for (var i = 0; i < wordlist.length ; i++) {
		ulist[wordlist[i].toUpperCase()] = 1;
	}
	var masterBucket = new Array();
	var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});

	client.search({
	index: requestObject.collectionName,
	type:requestObject.projectName,
	size: 0, //15
	body: 
	{ 
		"query" : {
			"filtered" : { 
				"query" : {
				"query_string" : {
					"query" :requestObject.searchString
				}
			}
		  }
		
		},"aggregations": {
			"files":{
			"terms":{ "field": "primary_feature","size":0 }
				}
			}
	}
	}).then(function (resp) {var temp = resp.aggregations;           
	var tempAry = temp.files.buckets;              
	masterBucket=[];            

	for(var i = 0;i< tempAry.length;i++){              

	masterBucket[i] = tempAry[i];               

	}               

console.log(masterBucket);
callBackFunction(masterBucket);

},function (error) {console.log(error);callBackFunction([])} );
},			
  
getQuery:function(requestObject) {
    var filteJson = {};
    if(requestObject.filterString && requestObject.filterString != '') {
      filteJson = {
          "query" : {
            "query_string" : {
              "query" : requestObject.filterString,
              "default_operator":"AND"
            }
          }
      }
    }

    //SIMY(08OCT): changing the type
    if(requestObject.serachType && requestObject.serachType == "conextsearch") {
    
	if(false)	
	{
     //SIMY(08OCT): changing the query
    var query = {
      "filtered" : { 
        "query": {
        "bool": {
         "should": [
		 { "more_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"percent_terms_to_match":0.01,"analyzer" :"cess_analyzer"}},
               { "more_like_this": { "fields" : ["title"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
			   {"match": {"title": {"query" :""+requestObject.title, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
            {"match": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match": {"_id": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match_phrase": {"title": {"query" :""+requestObject.title,"boost":10}}}
//{ "fuzzy_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString,"max_query_terms": 12,"boost":0.5,"analyzer" :"cess_analyzer" }}
            ],
        "minimum_should_match": 1
        }
      },"filter" : filteJson
      }
    };
    return query;
    }
	else
	{
		 var query = {
      "filtered" : { 
        "query": {
        "bool": {
         "should": [{ "more_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"percent_terms_to_match":0.01,"analyzer" :"cess_analyzer"}},
               { "more_like_this": { "fields" : ["title"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
			    { "more_like_this": { "fields" : ["fileslist"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
				{ "more_like_this": { "fields" : ["filediff"] , "like_text":""+requestObject.title, "min_term_freq": 1,"min_doc_freq": 1,"max_query_terms": 100,"boost":10,"analyzer" :"cess_analyzer" }},
            {"match": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
			{"match": {"_id": {"query" :""+requestObject.title+" "+requestObject.searchString, "operator": "and","boost": 3,"analyzer" :"cess_analyzer"}}},
            {"match": {"fileslist": {"query" :""+requestObject.title+" "+requestObject.searchString,"boost": 10,"analyzer" :"cess_analyzer"}}},
			 {"match": {"filediff": {"query" :""+requestObject.title+" "+requestObject.searchString,"boost": 10,"analyzer" :"cess_analyzer"}}},
			{"match_phrase": {"_all": {"query" :""+requestObject.title+" "+requestObject.searchString,"analyzer" :"cess_analyzer"}}}, 
{ "fuzzy_like_this": { "fields" : ["_all"] , "like_text":""+requestObject.title+" "+requestObject.searchString,"max_query_terms": 12,"boost":0.5,"analyzer" :"cess_analyzer" }}
            ],
        "minimum_should_match": 1
        }
      },"filter" : filteJson
      }
    };
		return query;
	}
	}
    else {
	if(requestObject.searchString.indexOf("files") > -1)
	{
    var query = {"filtered" : { 
                  "query": {"query_string": {"query": requestObject.searchString}},
                  "filter" : filteJson
                }};
				}
				else
				{
					 var query = {"filtered" : { 
                  "query": {"query_string": {"query": requestObject.searchString}},
                  "filter" : filteJson
                }};
				}
    return query;
    }
  },
  getFixedEngineerResults: function(requestObject,callBackFunction) {

if(!requestObject) {
callBackFunction(null); 
return;
}

var sString = requestObject.title+" "+requestObject.searchString;
//var wordlist = requestObject.searchString.trim().split(/[^a-zA-Z0-9]+/);
var wordlist = sString.trim().split(/[^a-zA-Z0-9]+/);
var ulist = {};
for (var i = 0; i < wordlist.length ; i++) {
	ulist[wordlist[i].toUpperCase()] = 1;
}

var masterBucket = new Array();
var client = new elasticsearch.Client({"host" : iseConstants.elasticsearchHost});


client.search({
index: requestObject.collectionName,
type:requestObject.projectName,
size: 0, //15
body: {

"aggregations": {
"resolvedBy": {"terms": {"field": "resolvedby"}}
},
"query" : {
"filtered" : { 
"query" : {
"query_string" : {
"query" :requestObject.searchString
				}
			}
		  }
		}
	}

	}).then(function (resp) 
	{
	console.log("resp"+resp)
	var temp = resp.aggregations;   
	console.log("resp"+temp)			
	
	var resolvedby = temp.resolvedBy.buckets;
	masterBucket=[];  
	
	
	for(var i = 0;i< resolvedby.length;i++){              

	masterBucket[i] = resolvedby[i];               

	}  
	console.log(masterBucket+"masterBucket");
	callBackFunction(masterBucket);

},function (error) {console.log(error);callBackFunction([])} );
},
    };
