// 改用Angular JS 實作
    
var EsConnector = angular.module('EsConnector', ['elasticsearch',"highcharts-ng"]);   // Build Angular Module

var color = ["red","blue","#fa2","green","orange","yellow"];

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
			
				var weight_dict = {} , QQ = [];
				
				keywords.push(hits[x]['_source']['keywords']);
				
				for(var num = 0 ; num < 10/*[x]['_source']['words_list'].length*/ ;num++){
					
					var weight = Math.round(parseFloat(hits[x]['_source']['words_list'][num][1])*1000000)/1000000;
					otherwords.push(hits[x]['_source']['words_list'][num][0]);	
					QQ.push(weight);
					// 存入dict
				}
				
				// Put into series data Structure
				weight_dict["data"] = QQ;
				weight_dict["color"] = color[x];
				weight_dict["name"] = hits[x]['_source']['keywords'];
				// weight_dict["font"] = hits[x]['_source']['keywords'];
				
				weighting.push(weight_dict); 
			}
			// { data: [1,2,3,4,5] ,color : "#F00", name:"唉呦不錯喔" }
		   $scope.words = GetUnique(keywords);
		   
		   $rootScope.$broadcast("changeWord" , {"otherwords":otherwords,"weighting":weighting});
		   
		});
      
	},true);
	
});



// HighChart Controller
EsConnector.controller('HighChartController', function ($scope) {
	
	
	$scope.$on("changeWord", function (event, param) {
		// if(param.otherwords == null){
			// $scope.removeRandomSeries();
		// }
			// $scope.chartConfig.series=[ 
				// { data: param.weighting ,color : "#F00", name:"唉呦不錯喔" },
				// { data: param.weighting ,color : "#0F0", name:"唉呦不錯喔2.0" },

			// ];
			
			$scope.chartConfig.series = param.weighting;
		
			$scope.chartConfig.xAxis.categories=param.otherwords;
         
    });
	

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.chartConfig = {
        options: {
            chart : {
                type: 'bar'  //pie可玩玩2
            },
			
			// tooltip conf
			tooltip : {    
				shared:true,
				// Header Conf
				headerFormat: '<span style="font-size: 25px;color:#06F;margin-top:5px;">{point.key}</span><br/>',
				// pointer Conf
				pointFormat: '<span style="color:{point.color};font-size:20px;">\u25CF</span> {series.name}: <b style="font-size:20px;">{point.y}</b><br>',

			},
			
			// button labels conf
			legend : {    
				itemStyle: {
					fontWeight: 'bold',
					fontSize: '25px'
				}
			}
        },
        series: [],
        title: {
            text: '歡迎搜尋!!',
			style: {
                    color: '#0066FF',
                    fontSize: '25px',
					marginTop:'10px'
            } 
        }, 
		// xAxis: [],
		xAxis: {     // 改左邊 title;
			categories: [],
			labels:{
				style:{
					color:"black",
					fontSize:"25px"
				}
			}
		
		},

        loading: false,
		
		// Change Highchart Size
		"size": {
			"height": "500"
		}
		
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