// 改用Angular JS 實作
    
var EsConnector = angular.module('EsConnector', ['elasticsearch',"highcharts-ng"]);   // Build Angular Module

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

// Query Controller
EsConnector.controller('QueryController', function($rootScope,$scope, es) {
	$scope.$watch('name', function(newValue, oldValue) {    // $watch監控model，一旦改變就觸發
		// 觸發 $watch 後的執行 function  
		es.search({
		index: 'michael8',
		 type : 'vec8',
		 body : {
					"query": {
					  "match_phrase": {"keywords":$scope.name}
					}
				  }
		   
		}).then(function (response) {
			
			
			var hits = response.hits.hits;
			otherwords=[] , weighting = [] , keywords = [];
			
			for (var x = 0; x<hits.length;x++){		
				
				keywords.push(hits[x]['_source']['keywords']);
				
				for(var num = 0 ; num < 10/*[x]['_source']['words_list'].length*/ ;num++){
					var weight = Math.round(parseFloat(hits[x]['_source']['words_list'][num][1])*1000000)/1000000;
					otherwords.push(hits[x]['_source']['words_list'][num][0]);	
					weighting.push(weight);
				}
				
			}
			
		   $scope.words = GetUnique(keywords);
		   
		   $rootScope.$broadcast("changeWord" , {"otherwords":otherwords,"weighting":weighting});
		   
		});
      
	},true);
	
});



// HighChart Controller
EsConnector.controller('HighChartController', function ($scope) {
	
	
	$scope.$on("changeWord", function (event, param) {
		if(param.otherwords == null){
			$scope.removeRandomSeries();
		}
			$scope.chartConfig.series=[ { data: param.weighting } ];
		
			$scope.chartConfig.xAxis[0].categories=param.otherwords;
         
    });
	
    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

	$scope.$watch('chartConfig.title.text', function(data) { 
		 $scope.addSeries(parseInt($scope.chartConfig.title.text));
	});
	
    // $scope.addSeries = function (num) {
        // var rnd = []
        // for (var i = 0; i < num; i++) {
            // rnd.push(Math.floor(Math.random() * 20) + 1)
        // }
        // $scope.chartConfig.series.push({
            // data: rnd
        // })
    // }

    // $scope.removeRandomSeries = function () {
        // var seriesArray = $scope.chartConfig.series;
		// seriesArray[0].remove();
	
    // }

    // $scope.swapChartType = function () {
        // if (this.chartConfig.options.chart.type === 'line') {
            // this.chartConfig.options.chart.type = 'bar'
        // } else {
            // this.chartConfig.options.chart.type = 'line'
            // this.chartConfig.options.chart.zoomType = 'x'
        // }
    // }

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'  //pie可玩玩
            }
        },
        series: [],
		color : "#F00",
        title: {
            text: '歡迎搜尋!!'
        }, 
		// xAxis: [],
		xAxis: [{     // 改左邊 title;
			categories: []//['old bar title', 'old bar title 2 ','第三個阿阿阿','第4個QQ']
		}],

        loading: false
    }

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