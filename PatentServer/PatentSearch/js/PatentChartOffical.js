// ready function
var count =0;
$(function(){    
	//FirstQuery();
	$('#submit').click(FirstQuery);  // Event Trigger with "Form Submit"
	
	// $("input[name='Chart']").click(showD3Chart);
	// $('#FChart').click(showForce);
	// $('#BChart').click(showBubble);
}); 

// function showD3Chart(){
	// var choice = $(this).attr('id');
	// if( choice == 'FChart'){
		// $('#forceLayout').css('display','block');
		// $('#bubbleChart').css('display','none');
	// } else if (choice == 'BChart'){
		// $('#forceLayout').css('display','none');
		// $('#bubbleChart').css('display','block');
	// }
	// alert($(this).attr('id'));
	
// }

	
// Connected With ElasticSearch
var client = new elasticsearch.Client({
	host: '10.120.26.16:9200',
	log: 'trace'
});	
	
//var elasticsearch = require("elasticsearch");

function FirstQuery(){
	
	var task = $('#task').val();
	$('#keyword').text(task);
	$('#hiddenKeyword').val(task);

	var query1st = {
			  index : 'test160gi',
			  type : 'testgi',
			  body : {
				"query": {
				  "match_phrase": {"words_sort":task}
				}
			  }
		}	
	
	client.search(query1st).then(function (resp) {

		var forceLayout_dic = {"name":"分群搜尋","children":[]};
		var bubblelist = [];
		var hits = resp.hits.hits;
		
		
		for (var x = 0; x<hits.length;x++){		
		
			for (var num = 0 ; num < hits[x]["_source"]["words_sort"].length;num++){
				if (hits[x]['_source']['words_sort'][num][0]==task){
					title = hits[x]['_source']['words_sort'][num][0] + ",權重:" + hits[x]['_source']['words_sort'][num][1];
					break;					
				} 
			}
			var dict_forcelayout = {"name":title,"children":[]};
			var dict_bubble = 
			
			for(var num = 0 ; num < 30 ;num++){
				dict_forcelayout["children"].push({"name":hits[x]['_source']['words_sort'][num][0],"size":hits[x]['_source']['words_sort'][num][1],"group":hits[x]["_source"]["group"]});
				bubblelist.push({"name":hits[x]['_source']['words_sort'][num][0],"size":hits[x]['_source']['words_sort'][num][1],"group":hits[x]["_source"]["group"]});
				// otherword.push(hits[x]['_source']['words_sort'][num]);	
			}
			// {name: "雞排,權重:___", count: "有幾篇專利文",其他關鍵字:[1,2,3,4,5]},
			forceLayout_dic["children"].push(dict_forcelayout);
			// for(var num = 0 ; num < hits[x]['_source']['number'].length ;num++){
				// numbers.push(hits[x]['_source']['number'][num]);
			// }		
		}
		alert("It's show time");
		// BubbleChart()//work
		ForceLayout(forceLayout_dic);
		$('#otherword').text(otherword);
		// Print OtherWords 
		 // $('#otherword').text(test["children"]["name"]);
		// var _ids = GetUnique(numbers);
		// $('#_ids').text(_ids);
		// $('#hiddenInput').val(_ids);
		// secondSearch(_ids);
	}, function (err) {
		console.trace(err.message);
	});	
	return false;	
}
	

	
function GetUnique(inputArray) {
		var outputArray = [];
		for (var i = 0; i < inputArray.length; i++) {
			if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
			outputArray.push(inputArray[i]);
			}
		}
		return outputArray;
}
	
	
function secondSearch(idNumbers){
	var query2nd = {
			  index : 'henry',
			  type : 'ray',
			  body : {
				"query": {
				  "terms": {"_id":idNumbers}
				}
			  }
		}
	
	client.search(query2nd).then(function (resp) {
		
		
		if ($('#content').length > 0 ){
			$('#content').remove();
		} 

		$('#bigWrapper').append('<div id= "content"></div>');
		
		var QQ = resp.hits.hits;    
		
		for (var num in QQ){
			count +=1 ;
			var ids = QQ[num]['_id'];
			var title = QQ[num]['_source']['title'];
			var claim = QQ[num]['_source']['claim'];
			$('#content').append('<h1>'+ids+'</h1>');
			$('#content').append('<h2>'+title+'</h2>');
			$('#content').append('<h6>'+claim+'</h6>');
		
		}	
		
	}, function (err) {
		console.trace(err.message);
	});	
}