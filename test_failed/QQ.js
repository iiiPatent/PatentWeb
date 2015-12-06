var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://10.120.30.17:9200',
  log: 'trace'
});

client.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity,

  // undocumented params are appended to the query string
  hello: "elasticsearch!"
}, function (error) {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});

// client.index({
  // index: 'sample',
  // type: 'document',
  // id: '1',
  // body: {
          // name: 'Reliability', 
          // text: 'Reliability is improved if multiple redundant sites are used, which makes well-designed cloud computing suitable for business continuity.'
  // }
// }, function (error, response) {
  // console.log(response);
// });
 // var task="Вы±Ж";


		// client.search({
			  // index : 'twitter',
			  // type : 'tweet',
			  // body : {
				// "query": {
				  // "match_phrase": {"name":"Reliability"}
				// }
			  // }
		// }).then(function (resp) {
			// var hits = resp.hits.hits;
			// var otherword=[] , numbers=[];
			// console.log('Вы±Ж'.toString());
			// console.log(resp);
			// for (var x = 0; x<hits.length;x++){		
				// for(var num = 0 ; num < hits[x]['_source']['keyword'].length ;num++){
					// otherword.push(hits[x]['_source']['keyword'][num]);	
				// }
				// for(var num = 0 ; num < hits[x]['_source']['number'].length ;num++){
					// numbers.push(hits[x]['_source']['number'][num]);
				// }		
			// }

		// }, function (err) {
			// console.trace(err.message);
		// });	 
		

client.search({
        index: 'twitter',
        type: 'tweet',
        body: {
            query: {
                query_string:{
                   query:"Вы±Ж"
                }
            }
        }
    }).then(function (resp) {
        console.log(resp);
    }, function (err) {
        console.log(err.message);
    });
