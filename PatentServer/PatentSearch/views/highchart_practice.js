//See: https://github.com/pablojim/highcharts-ng
var myapp = angular.module('myapp', ["highcharts-ng"]);

myapp.controller('myctrl', function ($scope) {

    $scope.addPoints = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray[rndIdx].data = seriesArray[rndIdx].data.concat([1, 10, 20])
    };

	$scope.$watch('chartConfig.title.text', function(data) { 
		 $scope.addSeries(parseInt($scope.chartConfig.title.text));
	});
	
    $scope.addSeries = function (num) {
        var rnd = []
        for (var i = 0; i < num; i++) {
            rnd.push(Math.floor(Math.random() * 20) + 1)
        }
        $scope.chartConfig.series.push({
            data: rnd
        })
    }

    $scope.removeRandomSeries = function () {
        var seriesArray = $scope.chartConfig.series
        var rndIdx = Math.floor(Math.random() * seriesArray.length);
        seriesArray.splice(rndIdx, 1)
    }

    $scope.swapChartType = function () {
        if (this.chartConfig.options.chart.type === 'line') {
            this.chartConfig.options.chart.type = 'bar'
        } else {
            this.chartConfig.options.chart.type = 'line'
            this.chartConfig.options.chart.zoomType = 'x'
        }
    }

    $scope.toggleLoading = function () {
        this.chartConfig.loading = !this.chartConfig.loading
    }

    $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [
		{
            data: [10, 15, 12, 8, 7]
			// name: "JJ阿阿"
        },
		{
			data: [17, 5, 4, 6, 9]
		}
		
		],
        title: {
            text: '1'
        },
		xAxis: [{
			categories: ['old bar title', 'old bar title 2 ','第三個阿阿阿','第4個QQ']
		}],
        loading: false
    }

});