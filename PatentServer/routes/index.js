module.exports = function(app){
	var count = 0;
	 // .get 後面放請求的路徑
	 app.get('/PatentChart.html',function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentChart.html';
		
		console.log(request.url);
		console.log(request.query.mainWord);
		// console.log(request.query.relatedWord);
		//response.redirect("https://www.youtube.com/");
		
		response.render(url,{message:request.query.mainWord});
		
	    //response.render(url,{bloody:"Fuck U Heap Size!!!!"});
	 });
	 
	 app.get('/Search.html',function(request,response){
		 var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/Search.html';
		//response.send({name:"QQ",age:"fuck u heap size!!!!"});
		response.sendFile(url);
		//response.redirect("/Search.html");
	 });
	 
	 // 之後要替換成post
	 app.get("/PatentView.html",function(request,response){
		var url = '/patent_test/patent_web/PatentServer/PatentSearch/views/PatentView.html';
		response.sendFile(url);
	 });
	

	// app.post('/PatentChart/',function(requset,response){
		// post data & ES+redirect 跳轉到P4 
		
	// }); __dirname+

	// Entrance
	app.get('/',function(request,response){
		response.sendFile('/patent_test/patent_web/PatentServer/PatentSearch/views/PatentSearch.html');
		count +=1 ; 
		console.log("QQ"+count);
	});

	
};