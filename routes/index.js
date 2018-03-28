var express = require('express');
var router = express.Router();

var fs = require('fs');

router.get('/', function(req, res, next) {
  	res.send('Hello');
});

router.get('/items/:no', function(req, res, next) {
  	var data = fs.readFileSync('./routes/data.json');
  	data = JSON.parse(data);
	var totalResult = data.items.length;
	
	var resultPerPage = 2;

	var pageNo = parseInt(req.params.no);
	if(pageNo > Math.ceil(totalResult/2)){
		res.json({err: "invalid pageNo"})
	}
	
	var start = pageNo * resultPerPage - 2;
	var end = start + resultPerPage;
	if (start + resultPerPage > totalResult) {
		end = totalResult;
	}
	
	data.items = data.items.slice(start, end);
	
	data.paginationInfo = {
		"totalResults": totalResult,
		"resultPerPage": resultPerPage,
		"currentPage": pageNo,
		"pages": Math.ceil(totalResult/resultPerPage)
	}
  	res.json(data);
});

//POST request to insert item
router.post('/items', function(req, res, next) {
	var data = fs.readFileSync('./routes/data.json');
	data = JSON.parse(data);
	var id = data.items[data.items.length-1].id;
	id = parseInt(id) + 1;
	if (!req.body.name && !req.body.Price && !req.body.Brand) {
		res.json({err:"Error Data insufficient"});
	}
	// console.log(req.body.name, req.body.Price, req.body.Brand);
	var dta = {
		"id": id,
		"name": req.body.name,
		"Price": req.body.Price,
		"Brand": req.body.Brand
	};
	data.items.push(dta);
	fs.writeFileSync('./routes/data.json', JSON.stringify(data));
	// fs.writeFile('./routes/data.json', JSON.stringify(data), function (err) {
	// 	if (err){
	// 		console.log(err);
	// 		res.json({err:"Error in storing item. "});
	// 	} 
	// 	// console.log(JSON.stringify(data));
	// 	console.log('writing to ' + './routes/data.json');
	// 	res.json(dta);
	// });
	res.json(dta);	  	
});

router.delete('/items/:id', function(req, res, next) {
  	var id = req.params.id;
  	var data = fs.readFileSync('./routes/data.json');
	data = JSON.parse(data);
	var index = -1;
	for (var i = 0; i < data.items.length; i++) {
		if(data.items[i].id == id){
			index = i;
			break;
		}
	}
	if(index == -1){
		res.json({status: "404", message: "id not found"});
	}
	data.items.splice(index, 1);
	fs.writeFileSync('./routes/data.json', JSON.stringify(data));
  	res.json({status: "200", message: "id deleted"});
});

router.patch('/items/:id', function(req, res, next) {
	var data = fs.readFileSync('./routes/data.json');
	data = JSON.parse(data);
	var id = req.params.id;
	var index = -1;
  	for (var i = 0; i < data.items.length; i++) {
  		if(data.items[i].id == id){
  			index = i;
  			break;
  		}
  	}
	if (index == -1) {
		res.json({status: "404", message: "id not found"});
		return
	}
	var dta = {
		"items":data.items[index]
	}
	res.json(dta);
});

module.exports = router;
