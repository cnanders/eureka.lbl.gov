'use strict';

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var fs = require('fs');

var destBuild;
var destJs;


/**
 * Angular modules are always pre-built.  This includes:
 * 	- placing each .html template into the template cache (converts .html to .js)
 * 	- concatenating all js files
 * 	- running sass on all sass files
 * 	- minifying single js and css file
 * Only build/styles.min.css and build/app.min.js are included in main website pages
 */


var modules = [
	'angular-modules/app'
];
moduleTasks = require('./gulp-tasks/ng-module-tasks')(gulp, plugins, modules)

/**
 * !!!!!!!!!!! IMPORTANT !!!!!!!!!!!!!!!
 * When you do the first build, important to run this first to populate the 
 * build folder of each angular app
 */

// gulp.task('default', function() {
// 	runSequence(
// 		moduleTasks
// 	);
// });
// return;



var packageJson = 'build.json';
var destJs = 'build/js';
var destCss = 'build/css';
var packages; // populated by task "load-json"
var ignore = ["test"];
var assets = {
	js: {
		libs: [],
		files: [],
	},
	css: {
		libs: [],
		files: [],
	}
};

/**
 * Check if the asset is a library asset (lib, bower_components)
 * @param {String} path - path relative to gulpfile.js
 * /angular/band/build/app.js
 * @returns {Boolean}
 */

var isLib = function(path) {

	var root = "";
	var libPrefix = root + "lib";
	var bowerPrefix = root + "bower_components"
	if (path.substring(0, libPrefix.length) === libPrefix ||
		path.substring(0, bowerPrefix.length) === bowerPrefix) {
		return true;
	} else {
		return false;
	}
}

var isExternal = function(path) {
	//var prefix = "//"
	var prefix = ["//", "http://", "https://"];
	for (var n = 0; n < prefix.length; n++) {
		if (path.substring(0, prefix[n].length) === prefix[n]) {
			return true;
		}
	}
	return false;
}

/**
 * Yii's assets require a preceding "/" on the path so assets are always absolute w.r.t
 * the webroot. Gulp reads files on the local machine, so need to strip this so it
 * is a relative path
 * @param {String} path - the abs path of the file w.r.t the webroot
 * @returns {String} - the relative path of the file w.r.t this file
 */

var relPath = function(path) {

	var root = "";
	var prefix = "/";
	var externalPrefix = ["//", "https://", "http://"];
	for (var n = 0; n < externalPrefix.length; n++) {
		if (path.substring(0, externalPrefix[n].length) === externalPrefix[n]) {
			return path;
		}
	}

	// Prefix non-external with "app-src/"
	return root + path.substring(prefix.length, path.length);

}

/**
 * Make sure that jsList and cssList contain all assets of the package and that
 * dependencies are included in the correct order
 * @param {String} name - the package name
 * @param {Object} packages - packages object (JSON of associative array)
 * @param {Object} assets - assets information
 * @param {Array} assets.js.libs - js library files
 * @param {Array} assets.js.files - custom js files we wrote
 */

var registerPackage = function(name) {

	console.log(name);
	// Don't register if is on ignore list
	if (ignore.indexOf(name) !== -1) {
		return;
	}

	var n;
	var file;

	// Add assets of dependencies
	for (n = 0; n < packages[name].depends.length; n++) {
		registerPackage(packages[name].depends[n]);
	}
	// Add js assets
	for (n = 0; n < packages[name].js.length; n++) {
		file = relPath(packages[name].baseUrl + '/' + packages[name].js[n]);

		if (isLib(file)) {
			if (assets.js.libs.indexOf(file) === -1) {
				assets.js.libs.push(file);
			}
		} else {
			if (assets.js.files.indexOf(file) === -1) {
				assets.js.files.push(file);
			}
		}
	}
	// Add css assets
	for (n = 0; n < packages[name].css.length; n++) {
		file = relPath(packages[name].baseUrl + '/' + packages[name].css[n]);
		if (isLib(file)) {
			if (assets.css.libs.indexOf(file) === -1) {
				assets.css.libs.push(file);
			}
		} else {
			if (assets.css.files.indexOf(file) === -1) {
				assets.css.files.push(file);
			}
		}
	}
}


var loadPackageJson = function() {
	packages = JSON.parse(fs.readFileSync(packageJson));
}

var registerPackages = function() {
	for (var name in packages) {
		registerPackage(name);
	}
}

/**
 * Log the name and size of every file in the list
 * @param {Array} files - list of relative file paths
 * @depends fs
 */

var logSizes = function(files) {

	var stats;
	var fileSizeInKb;
	var n, m;

	// First figure out the longest name and store it so they can be formatted nicely
	// in the console.

	var length = 0;

 	for (n = 0; n < files.length; n++) {

 		if (isExternal(files[n])) {
 			continue;
 		}

 		if (files[n].length > length) {
 			length = files[n].length
 		}
 	}

 	// Round the length up to the nearest tab stop

 	var spacePerTab = 8;
 	length = Math.ceil(length/spacePerTab)*spacePerTab;

	var msg, tabs;

 	for (n = 0; n < files.length; n++) {

 		if (isExternal(files[n])) {
 			continue;
 		}

 		stats = fs.statSync(files[n]);
 		fileSizeInKb = Math.round(10*stats["size"]/1000)/10;
 		msg = files[n];

 		// Add tabs
 		//console.log((length - files[n].length)/spacePerTab);
 		tabs = Math.ceil((length - files[n].length)/spacePerTab);
 		for (m = 0; m < tabs; m++) {
 			msg += "\t";
 		}
 		// Add size
 		msg += fileSizeInKb + "\t kB";
 		console.log(msg);
 	}
}

var logAssetSizes = function() {
	console.log('/** js libs */');
	logSizes(assets.js.libs);
	console.log('/** js files */');
	logSizes(assets.js.files);
	console.log('/** css libs */');
	logSizes(assets.css.libs);
	console.log('/** css files */');
	logSizes(assets.css.files);
}

loadPackageJson();
registerPackages();
//console.log(assets);
logAssetSizes();

/**
 * CSS
 */

/**
 * Concatenate all custom css files to one file and save as custom.js.  Run lint on all of
 * the js files.  Also create a minified version of the file, custom.min.js
 */

 gulp.task('css-custom', function () {
	return gulp.src(assets.css.files)
		.pipe(plugins.concat('custom.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.minifyCss())
		//.pipe(plugins.compress({
        //    type: 'css'
        //}))
		.pipe(gulp.dest(destCss))
});


/**
 * Concatenate all lib css files to one file and save as libs.css.  Also create a minified
 * version of this file.  Only need to do this when a new lib is added.
 */

 gulp.task('css-libs', function () {
	return gulp.src(assets.css.libs)
		.pipe(plugins.concat('libs.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.minifyCss())
		//.pipe(plugins.compress({
        //    type: 'css'
        //}))
		.pipe(gulp.dest(destCss))
});


/**
 * Combine libs.css and custom.css into one file.  Also create a gzipped version of
 * this file
 */

 gulp.task('css-libs-and-custom', function () {

	var files = [
		destCss + '/libs.css',
		destCss + '/custom.css',
	];

	return gulp.src(files)
		.pipe(plugins.concat('libs-and-custom.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(plugins.size({
			title: 'css/libs-and-custom.css'
		}))
});

/**
 * Combine libs.min.css and custom.min.css into one file.  Also create a gzipped version of
 * this file
 */

gulp.task('css-libs-and-custom-min', function() {

	var files = [
		destCss + '/libs.min.css',
		destCss + '/custom.min.css',
	];

	return gulp.src(files)
		.pipe(plugins.concat('libs-and-custom.min.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss))
		.pipe(plugins.size({
			title: 'css/libs-and-custom.min.css'
		}))
		// .pipe(plugins.gzip())
// 		.pipe(gulp.dest(destCss))
// 		.pipe(plugins.size({
// 			title: 'css/libs-and-custom.min.css.gz'
// 		}))
});



/**
 * JS
 */

/**
 * Concatenate all custom js files to one file and save as custom.js.  Run lint on all of
 * the js files.  Also create a minified version of the file, custom.min.js
 */

gulp.task('js-custom', function () {
	return gulp.src(assets.js.files)
		//.pipe(plugins.jshint(jshintConfig))
		//.pipe(plugins.jshint.reporter('default'))
		.pipe(plugins.plumber())
		.pipe(plugins.concat('custom.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 				// write to assets
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(destJs))
});

/**
 * Concatenate all lib js files to one file and save as libs.js.  Also create a minified
 * version of this file.  Only need to do this when a new lib is added.
 */

gulp.task('js-libs', function () {
	return gulp.src(assets.js.libs)
		.pipe(plugins.plumber())
		.pipe(plugins.concat('libs.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 						// write to assets
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest(destJs))
});

/**
 * Combine libs.js and custom.js into one file
 */

gulp.task('js-libs-and-custom', function () {
	var files = [
		destJs + '/libs.js',
		destJs + '/custom.js',
	];

	return gulp.src(files)
		.pipe(plugins.plumber())
		.pipe(plugins.concat('libs-and-custom.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 					// write to assets
		.pipe(plugins.size({
			title: 'js/libs-and-custom.js'
		}))
});


/**
 * Combine libs.min.js and custom.min.js into one file.  Also create a gzipped version of
 * this file
 */

gulp.task('js-libs-and-custom-min', function () {

	var files = [
		destJs + '/libs.min.js',
		destJs + '/custom.min.js',
	];

	return gulp.src(files)
		.pipe(plugins.plumber())
		.pipe(plugins.concat('libs-and-custom.min.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 					// write to assets
		.pipe(plugins.size({
			title: 'js/libs-and-custom.min.js'
		}))
		// .pipe(plugins.gzip())
// 		.pipe(gulp.dest(destJs)) 		// write app.js to build/app.js
// 		.pipe(plugins.size({
// 			title: 'js/libs-and-custom.min.js.gz'
// 		}))
});





gulp.task('css-libs-size', function() {
	return gulp.src(assets.css.libs)
	.pipe(plugins.size({
		showFiles: true,
		title: "css libs"
	}))
});


gulp.task('css-custom-size', function() {
	return gulp.src(assets.css.files)
	.pipe(plugins.size({
		showFiles: true,
		title: "css files"
	}))
});
gulp.task('js-libs-size', function() {
	return gulp.src(assets.js.libs)
	.pipe(plugins.size({
		showFiles: true,
		title: "js libs"
	}))
});
gulp.task('js-custom-size', function() {
	return gulp.src(assets.js.files)
	.pipe(plugins.size({
		showFiles: true,
		title: "js files"
	}))
});

gulp.task('size', function() {
	runSequence(
		'css-libs-size',
		'css-custom-size',
		'js-libs-size',
		'js-custom-size'
	);
});


gulp.task('build-css-sequence', function(){
	runSequence(
		'css-libs',
		'css-custom',
		'css-libs-and-custom',
		'css-libs-and-custom-min'
	);	
});


gulp.task('build-js-sequence', function(){
	runSequence(
		'js-libs',
		'js-custom',
		'js-libs-and-custom',
		'js-libs-and-custom-min'
	);	
});

// Used in watch - libraries never change so no need to re-concat and minify
// libraries in watch

gulp.task('build-css-sequence-no-libs', function(){
	runSequence(
		'css-custom',
		'css-libs-and-custom',
		'css-libs-and-custom-min'
	);	
});


gulp.task('build-js-sequence-no-libs', function(){
	runSequence(
		'js-custom',
		'js-libs-and-custom',
		'js-libs-and-custom-min'
	);	
});


gulp.task('build-sequence', function() {
	runSequence(
		'build-css-sequence',
		'build-js-sequence'
	);
});



// Watch 
gulp.task('build-watch', function() {

	gulp.watch(
		[assets.js.files], 
		['build-js-sequence-no-libs']
	);

	gulp.watch(
		[assets.css.files], 
		['build-css-sequence-no-libs']
	);
});

// Default task run all module tasks in parallel, then do the full package
// sequence.  The -watch module task watches for changes to assets and rebuilds
// libs-and-custom

gulp.task('default', function() {
	runSequence(
		moduleTasks,
		'build-sequence',
		'build-watch'
	);
});