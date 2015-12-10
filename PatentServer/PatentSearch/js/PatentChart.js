// ready function
$(function(){    
	FirstQuery();
	$('#theForm').submit(FirstQuery);  // Event Trigger with "Form Submit"
	$("input[name='Chart']").click(showD3Chart);
	// $('#FChart').click(showForce);
	// $('#BChart').click(showBubble);
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
	// alert($(this).attr('id'));
	
}

	
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
			  index : 'twitter',
			  type : 'tweet',
			  body : {
				"query": {
				  "match_phrase": {"keyword":task}
				}
			  }
		}	
	
	client.search(query1st).then(function (resp) {

		var hits = resp.hits.hits;
		var otherword=[] , numbers=[];
		
		for (var x = 0; x<hits.length;x++){		
			for(var num = 0 ; num < hits[x]['_source']['keyword'].length ;num++){
				otherword.push(hits[x]['_source']['keyword'][num]);	
			}
			for(var num = 0 ; num < hits[x]['_source']['number'].length ;num++){
				numbers.push(hits[x]['_source']['number'][num]);
			}		
		}
		
		// Print OtherWords 
		$('#otherword').text(GetUnique(otherword));
		var _ids = GetUnique(numbers);
		$('#_ids').text(_ids);
		$('#hiddenInput').val(_ids);
	
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
	
	
