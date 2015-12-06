module.exports = function(){
	var elasticsearch = require("elasticsearch");

	var client = new elasticsearch.Client({
			host: 'http://10.120.30.17:9200',
			log: 'trace'
	});

	function Search(word){
		var temp=[];

		client.search({
			  index: 'twitter',
			  type: 'tweet',
			  body: {
				"query": {
				  "match_phrase": {"keyword":word}
				}
			  }
		}).then(function (resp) {
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

		}, function (err) {
			console.trace(err.message);
		});	
		return false;	
	}
	
	
	
	
	
	
};

