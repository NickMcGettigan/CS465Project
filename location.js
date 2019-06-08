const request = require('request');


// Read in google key
function fileread(filename){
    var contents= fs.readFileSync(filename);
    return contents;
}

const fs =require("fs");
const key= fileread("key.txt").toString();
const raw_data = JSON.parse(fs.readFileSync('./location.json'));
//console.log(raw_data);

const url_prepend = 'https://maps.googleapis.com/maps/api/streetview?size=600x450';
const url_append = '&key=' + key;
const hint_prepend = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=';
const hint_append = '&limit=1&format=json';
var random;

module.exports = {
	getLocation: function() {
		var max=(Object.keys(raw_data).length); // max location # + 1  
		random =Math.floor(Math.random() * (max)); 

		let hint = new Promise((resolve, reject) =>  {
			request(hint_prepend + raw_data[random].hint + hint_append, { json: true }, (err, res, body) => {
				if (err) { return console.log(err); }
				var re = new RegExp(raw_data[random].name, "gi");
				hint_text = res.body[2].toString().replace(re,"This");

				resolve(hint_text);
			});
		})

		hint
		.then((hint_text) => {
			var location = {
				"name": raw_data[random].name,
				"alias" : raw_data[random].alias,
				"URL" : url_prepend + raw_data[random].URL + url_append,
				"hint" : hint_text
			}
			return location;
		})
		.catch((err) => {
			console.log("Error: " + err);
		});
	}
}


/*
// Hint Info
//https://en.wikipedia.org/w/api.php?action=opensearch&search=arc_de_triomphe&limit=1&format=json
request('https://en.wikipedia.org/w/api.php?action=opensearch&search=big_ben&limit=1&format=json', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  //console.log(res.body[2]);
});

*/