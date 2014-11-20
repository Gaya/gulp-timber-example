var gulp = require('gulp'),
    Twig = require('twig'),
    fs = require('fs'),
    _ = require('underscore');

var paths = {
	views: "./views", //path where your .twig files are
	data: "./data", //path to the data .json files
	dest: "./dist" //destination of the html files
};

gulp.task('timber', function (cb) {
	"use strict";
    //standard function called in Timber templates
    Twig.extendFunction("function", function (name) {
        return "<!--- function called " + name + " -->";
    });
    Twig.cache(false); //disable cache to prevent HTML not updating

    var files = fs.readdirSync("./" + paths.views); //read all the files in 'views'
    files.forEach(function (file) {
    	//if the file name doesn't match template-*.twig: skip this file
        if (file.substr(-5) !== ".twig" || file.indexOf("template-") === -1) {
        	return; 
        }

        var template = Twig.twig({
            path: paths.views + "/" + file,
            async: false
        }); //read the file with Twig

        //read the base Timber .json file
        var data = require(paths.data + "/timber.json");

        //check it template-*.json exists
        var templateData = file.replace(".twig", ".json");
        if (fs.existsSync(paths.data + "/" + templateData)) {
        	//if so, join its data with the base information
            _.extend(data, require(paths.data + "/" + templateData));
        }

        //replace .twig with .html in the file name, render the file and save the outcome
        fs.writeFile(paths.dest + "/" + file.replace(".twig", ".html"), template.render(data));
    });
    cb();
});