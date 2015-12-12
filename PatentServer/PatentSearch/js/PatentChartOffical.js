// ready function
var count =0;
$(function(){    

	$('#submit').click(Query);  // Event Trigger with "Form Submit"
	Query();
	$("input[name='Chart']").click(showD3Chart);
	
}); 

function showD3Chart(){
	var choice = $(this).attr('id');
	if( choice == 'FChart'){
		$('#forceLayout').css('display','block');
		$('#bubbleChart').css('display','none');
	} else if (choice == 'BChart'){
		$('#forceLayout').css('display','none');
		$('#bubbleChart').css('display','block');
	}
	
}

	
// Connected With ElasticSearch
var client = new elasticsearch.Client({
	host: '10.120.26.16:9200',
	log: 'trace'
});	
	
//var elasticsearch = require("elasticsearch");

function Query(){
	
	var task = $('#task').val();
	$('#keyword').text(task);
	$('#hiddenKeyword').val(task);

	var query1st = {
			  index : '40000_2',
			  type : 'kmeans',
			  body : {
				"query": {
				  "match_phrase": {"words_sort":task}
				}
			  }
		}	
	
	client.search(query1st).then(function (resp) {

		var forceLayout_dic = {"name":"分群搜尋","children":[]};
		var title;
		bubble_list = [];
		
		hits = resp.hits.hits;
		
		
		for (var x = 0; x<hits.length;x++){		
		
			for (var num = 0 ; num < hits[x]["_source"]["words_sort"].length;num++){
				if (hits[x]['_source']['words_sort'][num][0]==task){
					var weight_title = parseFloat(hits[x]['_source']['words_sort'][num][1]);
					title = hits[x]['_source']['words_sort'][num][0] + ",權重:" + parseFloat(Math.round(weight_title*100)/100);
					break;					
				} 
			}
			
			var bubble_dic = {"name":title,"count":hits[x]["_source"]["id"].length,"group":hits[x]["_source"]["group"]};
			var dict_forcelayout = {"name":title,"children":[]};
			var keywords_bubble = [];
			
			for(var num = 0 ; num < 30 ;num++){
				
				var weight = parseFloat(hits[x]['_source']['words_sort'][num][1]);
				dict_forcelayout["children"].push({"name":hits[x]['_source']['words_sort'][num][0] + ",權重:" + parseFloat(Math.round(weight*100)/100),"size":hits[x]['_source']['words_sort'][num][1],"group":hits[x]["_source"]["group"]});
				keywords_bubble.push(hits[x]['_source']['words_sort'][num][0]+'('+hits[x]['_source']['words_sort'][num][1]+')');

			}
			
			// {name: "雞排,權重:___", count: "有幾篇專利文",otherwords:[1,2,3,4,5]},
			// bubble_list [{"name":____,"count":_____,"otherwords":_____}]
			forceLayout_dic["children"].push(dict_forcelayout);
			bubble_dic["otherwords"] = keywords_bubble;
			bubble_list.push(bubble_dic);
			
			
		}
		
		alert("It's show time");
		 
		ForceLayout(forceLayout_dic); // 小Error : 重新搜尋後字不變!?
		// alert("bubble");
		BubbleLayout();
		// testQQ();
		// alert("yeswacan!!!");
		// $('#otherword').text(otherword);
		// Print OtherWords 
		 // $('#otherword').text(test["children"]["name"]);
		// var _ids = GetUnique(numbers);
		// $('#_ids').text(_ids);
		// $('#hiddenNum').val(_ids);
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
	
