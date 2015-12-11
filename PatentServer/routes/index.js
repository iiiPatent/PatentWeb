module.exports = function(app){
	var count = 0;
	 // .get 後面放請求的路徑
	 var bodyParser = require('body-parser');
	 var urlencodedParser = bodyParser.urlencoded({ extended: false });
	 
	 app.get('/PatentChart.html',function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentChart.html';
		var test = '/patent_test/patent_web/PatentServer/PatentSearch/views/Patents_test.json';
		console.log(request.url);
		console.log(request.query.mainWord);	
		
		response.render(url,{message:request.query.mainWord});
	 });
	 
	 app.get('/Search.html',function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/Search.html';
		response.sendFile(url);
		//response.redirect("/Search.html");
		//response.send({name:"QQ",age:"fuck u heap size!!!!"});
	 });
	 

	app.post('/PatentView.html/', urlencodedParser,function(request,response){
		// post data & ES+redirect 跳轉到P4 
		
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentView.html';
		//var QQ = {name:"QQAAAAAA",age:"Fuck U heap size!!!"};
		var json = JSON.stringify(request.body.numbers);   // 包成json
 
		response.render(url,{applicationNumbers:json,keyword:request.body.hiddenkeyword});
		// response.json();
		// response.end();
	}); 


	// Entrance
	app.get('/',function(request,response){
		response.sendFile('/patent_test/patent_web/PatentServer/PatentSearch/views/PatentSearch.html');
		count +=1 ; 
		console.log("QQ"+count);
	});

	// 雛型完成x
};