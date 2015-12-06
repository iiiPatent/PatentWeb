
	// AngularJS code
  //定義變數 (後面query會用到的)
	var client = new elasticsearch.Client({
	    host: 'http://10.120.30.17:9200',
	    log: 'trace'
	});
	// var ExampleApp = angular.module('ExampleApp', ['elasticsearch']);
	// ExampleApp.service('client', function (esFactory) {
	  // return esFactory({
		// host: 'http://10.120.30.17:9200',
		// apiVersion: '1.1',
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
	
	
	//在一開始就先和elasticsearch連接
	
	//var elasticsearch = require("elasticsearch");
	
	
	
	
	
	$(function(){      // ready function
		addList();
		$('#theForm').submit(addList);
	});   

	//當表單submit的時候，開始動作
	
	//將關鍵字print出來，並且去ES query 
	function addList(){
		var temp=[];
		//var otherword=[];
		var task = document.getElementById('task').value;
		document.getElementById('keyword').innerHTML = task;
		client.search({
			  index: 'twitter',
			  type: 'tweet',
			  body: {
				"query": {
				  "match_phrase": {"keyword":task}
				}
			  }
		}).then(function (resp) {
			var hits = resp.hits.hits;
			var otherword=[];
			for (var x = 0; x<hits.length;x++){
				//otherword.push(hits[x]['_source']['keyword']);
				for (var num in hits[x]['_source']['keyword']){
					otherword.push(hits[x]['_source']['keyword'][num]);
				}
				
				for (var qq in hits[x]['_source']['number']){
					temp.push(hits[x]['_source']['number'][qq]);
				}
		
			}
			
			printOtherword(GetUnique(otherword));
			//呼叫另一個function做第二次的query
			doSecond(GetUnique(temp));
		}, function (err) {
			console.trace(err.message);
		});	
		return false;	
	}
	
	function doSecond(testtemp){
		client.search({
			  index: 'henry',
			  type: 'ray',
			  body: {
				"query": {
				  "terms": {"_id":testtemp}
				}
			  }
		}).then(function (resp) {
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
	
	
	function printOtherword(otherword){
		document.getElementById('otherword').innerHTML = otherword;
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
	
	
	
	