#!/usr/bin/env node

//For command line interface commands and arguments.
var program = require('commander');
//For http requests.
var request = require('request');
//For String styling and colors.
var chalk = require('chalk');
//Include json file.
var pJson = require('./package.json');

program
	.version(pJson.version)
	.usage('[options] <keywords>')
	.option('-o, --owner [name]', 'Filter by the repositories owner')
	.option('-l, --language [language]', 'Filter by the repositories language')
	.option('-f, --full', 'Full output without any styling, in json')
	.parse(process.argv);

if(!program.args.length) {
	program.help();

} else {
    //Arguments as keywords.
	var keywords = program.args;
	//Github api end point for searching keyworkds.
    var url = 'https://api.github.com/search/repositories?sort=stars&order=desc&q='+keywords;

    //Add owner if it exists.
	if(program.owner) {
		url = url + '+user:' + program.owner;
	}

    //Add language if it exists.
	if(program.language) {
		url = url + '+language:' + program.language;
	}

    //Http request to github with url that we already formed.
	request({
		method: 'GET',
		headers: {
			'User-Agent': 'muhammadarslan'
		},
		url: url
	}, function(error, response, body) {

		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body);
			if(program.full) {
                //Print plain json if you don't want to format.
				console.log(body);
			} else {
                //Loop through all the results and print it on console.
				for(var i = 0; i < body.items.length; i++) {
					console.log(chalk.cyan.bold('Name: ' + body.items[i].name));
					console.log(chalk.magenta.bold('Owner: ' + body.items[i].owner.login));
					console.log(chalk.grey('Desc: ' + body.items[i].description + '\n'));
					console.log(chalk.grey('Clone url: ' + body.items[i].clone_url + '\n'));
				}
				process.exit(0);
			}
			process.exit(0);
		} else if (error) {
			console.log(chalk.red('Error: ' + error));
			process.exit(1);
		}
	});
}
