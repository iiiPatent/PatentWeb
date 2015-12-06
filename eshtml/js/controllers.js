angular.module('controllers',[])
	   .controller('SearchCtrl', function($scope,ejsResource){
			var ejs = ejsResource("http://10.120.30.17:9200");
		    var oQuery = ejs.QueryStringQuery().defaultField('Title');
		   
		    var client = ejs.Request()
							.indices('twitter')
							.types('tweet');
							
			$scope.search = function(){
				$scope.results = client
					  .query(oQuery.query($scope.queryTerm || "*"))
					  .doSearch();
				
			};
		   
	   });