// Connected With ElasticSearch
var client = new elasticsearch.Client({
	host: 'http://10.120.26.16:9200',
	log: 'trace'
});	
	
var count = 0;
	
$(function(){
	
	// var _ids = $.parseJSON($("#test").text());   //將讀到的檔案轉成Json
	var _ids = $('#hidden_ids').val().replace(/"/g,'').split(","); 	// turn out to be array 
	
	// for (var num in _ids){
		// alert(_ids[num]);
	// }
	//	alert(_ids);
	
	secondSearch(GetUnique(_ids));	
	
});

function secondSearch(idNumbers){
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
			count +=1 ;
			var ids = QQ[num]['_id'];
			var title = QQ[num]['_source']['title'];
			var claim = QQ[num]['_source']['claim'];
			// $('#content').append('<h1>'+ids+'</h1>');
			// $('#content').append('<h2>'+title+'</h2>');
			// $('#content').append('<h6>'+claim+'</h6>');
			$('#TableView').append( '<tr>\
							  <td>'+ count +'</td>\
							  <td>專利編號</td>\
							  <td>'+ ids +'</td>\
							  <td>公告/公開日</td>\
							  <td>2015/11/01</td>\
							  <td>專利名稱</td>\
							  <td class="tlt">'+title+'</td>\
							  </tr>\
							  <tr>\
							  <td colspan="100" align="left" class="testQQ"><div class="wordslimit">'+ claim +'</div>\
							  <div class="show less"> 顯示更多</div>\
							  </td>\
							  <\tr>\
							  ');
		}	
		// $('.testQQ').textillate({ minDisplayTime: 1000 , in: { effect: 'fadeInUp' ,  sync: true} });
		//保留顯示更多，特效改天trytry
		
		$('.show').click(showMore);
		$('.tlt').textillate({in:{effect:'fadeInUp'}});		
		
	}, function (err) {
		console.trace(err.message);
	});	
}


function showMore(){
	if (! $(this).hasClass('less')){
        $(this).removeClass('more').addClass('less').prev('.wordsnolimit').removeClass('wordsnolimit').addClass('wordslimit');
        $(this).text('顯示更多');
    } else {
        $(this).removeClass('less').addClass('more').prev('.wordslimit').removeClass('wordslimit').addClass('wordsnolimit');
        $(this).text('恢復上一動');
    }

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