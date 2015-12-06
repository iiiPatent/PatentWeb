// ready function

$(function(){    
		$('#theForm').submit(FirstQuery);  // Event Trigger with "Form Submit"
		
}); 
	
// Connected With ElasticSearch
var client = new elasticsearch.Client({
	host: 'http://10.120.30.17:9200',
	log: 'trace'
});	
	
//var elasticsearch = require("elasticsearch");

function FirstQuery(){
	
	var task = $('#task').val();
	$('#keyword').text(task);
		// var task = document.getElementById('task').value;
		// document.getElementById('keyword').innerHTML = task;
		
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
			
		// Seconde Query
		SecondQuery(GetUnique(numbers));
	}, function (err) {
		console.trace(err.message);
	});	
	return false;	
}
	
function SecondQuery(idNumbers){
	
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
	
function GetUnique(inputArray) {
		var outputArray = [];
		for (var i = 0; i < inputArray.length; i++) {
			if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
			outputArray.push(inputArray[i]);
			}
		}
		return outputArray;
}
	
	
// { AngularJS code
  
	// var ExampleApp = angular.module('ExampleApp', ['elasticsearch']);
	// ExampleApp.service('client', function (esFactory) {
	  // return esFactory({
		// host: 'http://10.120.30.17:9200',
		// apiVersion: '2.1',
		// log: 'trace'
	  // });
	// });

	// ExampleApp.controller('ExampleController', function ($scope, client, esFactory) {

	  // client.cluster.state({
		// metric: [
		  // 'cluster_name',
		  // 'nodes',
		  // 'master_node',
		  // 'version'
		// ]
	  // })
	  // .then(function (resp) {
		// $scope.clusterState = resp;
		// $scope.error = null;
	  // })
	  // .catch(function (err) {
		// $scope.clusterState = null;
		// $scope.error = err;

		// if (err instanceof esFactory.errors.NoConnections) {
		  // $scope.error = new Error('Unable to connect to elasticsearch. ' +
			// 'Make sure that it is running and listening at http://10.120.30.17:9200');
		// }
	  // });

	// });
// }
	