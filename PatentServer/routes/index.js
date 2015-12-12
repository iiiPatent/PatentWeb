module.exports = function(app){
	var count = 0;
	 // .get 後面放請求的路徑
	 var bodyParser = require('body-parser');
	 var urlencodedParser = bodyParser.urlencoded({ extended: false });
	 
	 app.get('/PatentChart_final.html',function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentChart_final.html';
		
		console.log(request.url);
		console.log(request.query.mainWord);	
		
		response.render(url,{message:request.query.mainWord});
	 });
	 
	 app.get('/Search_final.html',function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/Search_final.html';
		response.sendFile(url);

	 });
	 

	app.post('/PatentView_final.html/', urlencodedParser,function(request,response){
		
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentView_final.html';
	
		var json = JSON.stringify(request.body.numbers);   // 包成json
 
		response.render(url,{applicationNumbers:json,keyword:request.body.hiddenkeyword});

	}); 


	// Entrance
	app.get('/',function(request,response){
		response.sendFile('/patent_test/patent_web/PatentServer/PatentSearch/views/PatentMagnifier.html');
		count +=1 ; 
		console.log("QQ"+count);
	});

	// 雛型完成x
};