// 改用Angular JS 實作
    
var EsConnector = angular.module('EsConnector', ['elasticsearch']);   // Build Angular Module

EsConnector.service('es', function (esFactory) {    // Connection to ElasticSearch
  return esFactory({ host: '10.120.26.16:9200' });
});


EsConnector.controller('ServerHealthController', function($scope, es) {

    es.cluster.health(function (err, resp) {
        if (err) {
            $scope.data = err.message;
        } else {
            $scope.data = resp;
        }
    });
});


EsConnector.controller('QueryController', function($scope, es) {
	$scope.$watch('name', function(newValue, oldValue) {    // $watch監控model，一旦改變就觸發
		// 觸發 $watch 後的執行 function  
		es.search({
		index: 'twitter',
		 type : 'tweet',
		 body : {
					"query": {
					  "match_phrase": {"keyword":$scope.name}
					}
				  }
		   
		}).then(function (response) {
			
			
			var hits = response.hits.hits;
			var otherword=[]  ;
		
			for (var x = 0; x<hits.length;x++){		
				for(var num = 0 ; num < hits[x]['_source']['keyword'].length ;num++){
				otherword.push(hits[x]['_source']['keyword'][num]);	
				}
				
			}
			
		   $scope.words = GetUnique(otherword);
		   
		});
      
	},true);
	
});
	

function GetUnique(inputArray) {
	var outputArray = [];
	for (var i = 0; i < inputArray.length; i++) {
		if ((jQuery.inArray(inputArray[i], outputArray)) == -1) {
		outputArray.push(inputArray[i]);
		}
	}
	return outputArray;
}

//定義變數 (後面query會用到的)
/* var client = new elasticsearch.Client({
	host: 'http://10.120.26.16:9200',
	log: 'trace'
}); */

	
//  ES work when #mainWord changing;
/* function firstSearch(){
	
	var mainWord = $('#mainWord').val();


	var query1st = {
			  index : 'twitter',
			  type : 'tweet',
			  body : {
				"query": {
				  "match_phrase": {"keyword":mainWord}
				}
			  }
		}	
	
	client.search(query1st).then(function (resp) {

		var hits = resp.hits.hits;
		var otherword=[]  ;
		
		for (var x = 0; x<hits.length;x++){		
			for(var num = 0 ; num < hits[x]['_source']['keyword'].length ;num++){
				otherword.push(hits[x]['_source']['keyword'][num]);	
			}
				
		}
		

		$('#relatedWord').val(GetUnique(otherword));
		
	}, function (err) {
		console.trace(err.message);
	});	
	return false;	
}	 */	