'use strict';

// Include gulp
var gulp       	= require('gulp')

// Include plugins

// Utilities
var concat     	= require('gulp-concat');
var plumber    	= require('gulp-plumber');
var sourcemaps 	= require('gulp-sourcemaps');
var rename 		= require('gulp-rename');
var notify 		= require("gulp-notify");
var addsrc 		= require('gulp-add-src');
var runSequence = require('run-sequence');
var compress 	= require('gulp-yuicompressor');
var fs 			= require('fs');
var size 		= require('gulp-size');


// Scripts
var uglify     	= require('gulp-uglify');
var jshint 		= require('gulp-jshint');
var gzip 		= require('gulp-gzip');

// Sass
//var sass 		= require('gulp-ruby-sass');
var sass 		= require('gulp-sass');
var minifycss 	= require('gulp-minify-css');

// Angular
var html2js 		= require('gulp-html2js');    // Had problems with this not creating single module
var ngHtml2Js 		= require('gulp-ng-html2js');
var minifyHtml 		= require("gulp-minify-html");
var ngAnnotate 		= require('gulp-ng-annotate');
var templateCache 	= require('gulp-angular-templatecache');

var jshintConfig = {
	asi: true,  	// Omit "missing semicolon" warning
	globals: {
		$: true,
		angular: true,
		swfFocus: true,
		swfIsReady: true,
		swfobject: true,
		loadXml: true,
		csrfToken: true,
		csrfTokenName: true,
	},
	browser: true  // This option defines globals exposed by modern browsers
};

var sassConfig = {
	errLogToConsole: true,
};


var destAssets;
var destJs;
var defaultTasks = [];

var modules = [
   'angular-modules/book1'
];

for (var n = 0; n < modules.length; n++) {

	console.log('Adding tasks for module: ' + modules[n]);

	// Need to use IIFE since the loop variable will have changed by the time the
	// task callback executes
	// http://stackoverflow.com/questions/22968516/creating-tasks-using-a-loop-gulp

	(function(module) {

		destAssets = module + '/assets';

		// Lint Task
		gulp.task(module + '-lint', function() {

			// All descendant folders with .js files
			console.log(module + '/js/**/*.js');

			return gulp.src(module + '/js/**/*.js')
				.pipe(jshint(jshintConfig))
				.pipe(jshint.reporter('default'))
				//.pipe(notify({ message: module + ' lint task complete' }));
		});

		// Build multi .run() commands for the angular module that place each .html file
		// into the template cache of the module.  ngHtml2Js does this by generating JS
		// code that evokes the .run()
		// method of the module (whose name is set by the moduleName parameter).  So the
		// module name here needs to be the name of the module
		//
		// The 'templates' and 'scripts' tasks need to execute synchronously since I want
		// the 'scripts' task to include templates.js in the concatenated and minified
		// script.  All that is required is to pass a task dependency into the 'scripts'
		// task as discussed in the documentation here
		//
		// https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-tasks-in-series.md
		//
		// It is important to write this file to a location that is not watched by the
		// scripts task, otherwise it gets into an infinite loop.  The solution is to
		// write it to templates/cache.js.  Originally I was writing to js, however the
		// watch for the scripts would see this file get written and


		gulp.task(module + '-templates', function () {



			return gulp.src([
			    module + "/templates/**/*.html",
			    module + "/templates/**/*.json",
			])
				.pipe(minifyHtml({
					empty: true,
					spare: true,
					quotes: true
				}))
				.pipe(templateCache('cache.js', {
					module: module.split("/").pop(),
					root: 'templates/',
				}))
        .pipe(gulp.dest(module + '/templates'));


			/*
			return gulp.src([module + "/templates/*.html"])
				.pipe(minifyHtml({
					empty: true,
					spare: true,
					quotes: true
				}))
				.pipe(ngHtml2Js({
					moduleName: module,
					prefix: "templates/",
					declareModule: false
				}))
				.pipe(concat("cache.js")) 			// concatenate as templates.js
				//.pipe(uglify())					// compress (no need because is is compressed with scripts task)
				.pipe(gulp.dest(module + '/templates'))				// write to templates/all.js
				//.pipe(notify({ message: module + ' templates task complete' }));
		 	*/
		});

		// Concatenate & minify scripts.
		// This task has a dependency on the templates task (see above).
		// For Angular, it is important that the module.js scripts are ordered first
		// in the concatenation  because they contain the constructors of the Angular
		// modules

		gulp.task(module + '-scripts', function () {

			// All descendant folders with .js files
			// Make sure any files named module appear first (for Angular)
			// If this task is executed after templates, it will include templates.js

			return gulp.src([module + '/js/**/module.js', module + '/js/**/*.js', module + '/templates/cache.js'])
				//.pipe(sourcemaps.init())
				.pipe(plumber())
				.pipe(concat('app.js'))			// concatenate them all to a file named app.js
				.pipe(ngAnnotate()) 			// fix angular dependency injection issue
				.pipe(gulp.dest(destAssets)) 		// write app.js to assets/app.js
				.pipe(rename({suffix: '.min'}))
				.pipe(uglify()) 				// uglify
				//.pipe(sourcemaps.write())
				.pipe(gulp.dest(destAssets)) 		// write app.min.js to assets/app.min.js
				//.pipe(notify({ message: module + ' scripts task complete' }))
		});

		gulp.task(module + '-templates-and-scripts', function() {
		  	runSequence(module + '-templates', module + '-scripts');
		});

		// Compile Our Sass
		gulp.task(module + '-sass', function() {

			return gulp.src([module + '/scss/style.scss'])
				//.pipe(plumber())
				.pipe(sass(sassConfig))
				.pipe(gulp.dest(destAssets))
				.pipe(rename({suffix: '.min'}))
				.pipe(minifycss())
				.pipe(gulp.dest(destAssets))
				//.pipe(notify({ message: module + ' sass task complete' }));
		});


		//gulp.task(module + '-templates-and-scripts', [module + '-booyah', module + '-scripts']);

		// Watch Files For Changes
		gulp.task(module + '-watch', function() {

			// Watch .js files; run lint, then scripts tasks
			gulp.watch(module + '/js/**/*.js', [module + '-lint', module + '-templates-and-scripts']);

			// Watch .scss files; run sass task
			gulp.watch(module + '/scss/*.scss', [module + '-sass']);

			// Watch .html files; run templates task and scripts task (to concatenate
			// new cache.js to the js code
			gulp.watch(module + '/templates/**/*.html', [module + '-templates-and-scripts']);
		});


    // Define a sequence task for the angular module

		gulp.task(module + '-sequence', function() {
      runSequence(
        module + '-lint',
        module + '-templates',
        module + '-scripts',
        module + '-sass'
        //modules[n] + '-watch',
      );
    });



	})(modules[n]);


  //defaultTasks.push(modules[n] + '-sequence');

  defaultTasks.push(modules[n] + '-lint');
	defaultTasks.push(modules[n] + '-templates-and-scripts');
	defaultTasks.push(modules[n] + '-scripts');
	defaultTasks.push(modules[n] + '-sass');
	defaultTasks.push(modules[n] + '-watch');

}

// Default Task
//gulp.task('default', defaultTasks);
//return;

var packageJson = 'build.json';
var destJs = 'assets/js';
var destCss = 'assets/css';
var packages; // populated by task "load-json"
var ignore = [
  "test"
];
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
 * @param {String} path - the abs path of the file w.r.t the webroot i.e.,
 * /angular/band/assets/app.js
 * @returns {Boolean}
 */

var isLib = function(path) {
	var libPrefix = "lib";
	var bowerPrefix = "bower_components"
	if (path.substring(0, libPrefix.length) === libPrefix ||
		path.substring(0, bowerPrefix.length) === bowerPrefix) {
		return true;
	} else {
		return false;
	}
}

var isExternal = function(path) {
	var prefix = "//"
	if (path.substring(0, prefix.length) === prefix) {
		return true;
	} else {
		return false;
	}
}

/**
 * Yii's assets require a preceding "/" on the path so assets are always absolute w.r.t
 * the webroot. Gulp reads files on the local machine, so need to strip this so it
 * is a relative path
 * @param {String} path - the abs path of the file w.r.t the webroot
 * @returns {String} - the relative path of the file w.r.t this file
 */

var relPath = function(path) {
	var prefix = "/";
	var externalPrefix = "//";
	if (path.substring(0, externalPrefix.length) === externalPrefix) {
		return path;
	} else {
		return path.substring(prefix.length, path.length);
	}
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

/*
sassConfig = {
	images_dir: "images",
	javascripts_dir: "js",
	output_style: "compressed",
	environment: "production",
	errLogToConsole: true,
}
gulp.task('css-custom', function () {
	return gulp.src('sass/style.scss')

		.pipe(sass(sassConfig))
		.pipe(gulp.dest(destCss))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest(destCss))
});
defaultTasks.push('css-custom');
*/


/**
 * Concatenate all custom css files to one file and save as custom.js.  Run lint on all of
 * the js files.  Also create a minified version of the file, custom.min.js
 */

 gulp.task('css-custom', function () {
	return gulp.src(assets.css.files)
		.pipe(concat('custom.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		//.pipe(compress({
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
		.pipe(concat('libs.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		//.pipe(compress({
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
		.pipe(concat('libs-and-custom.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss)) 						// write to assets
		.pipe(size({
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
		.pipe(concat('libs-and-custom.min.css'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destCss))
		.pipe(size({
			title: 'css/libs-and-custom.min.css'
		}))
		.pipe(gzip())
		.pipe(gulp.dest(destCss))
		.pipe(size({
			title: 'css/libs-and-custom.min.css.gz'
		}))
});



/*
gulp.task('css-sequence', function() {
	runSequence(
		'css-custom',
		'css-libs',
		'css-libs-and-custom'
	);
});
*/

/**
 * JS
 */

/**
 * Concatenate all custom js files to one file and save as custom.js.  Run lint on all of
 * the js files.  Also create a minified version of the file, custom.min.js
 */

gulp.task('js-custom', function () {
	return gulp.src(assets.js.files)
		//.pipe(jshint(jshintConfig))
		//.pipe(jshint.reporter('default'))
		.pipe(plumber())
		.pipe(concat('custom.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 				// write to assets
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(destJs))
});

/**
 * Concatenate all lib js files to one file and save as libs.js.  Also create a minified
 * version of this file.  Only need to do this when a new lib is added.
 */

gulp.task('js-libs', function () {
	return gulp.src(assets.js.libs)
		.pipe(plumber())
		.pipe(concat('libs.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 						// write to assets
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
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
		.pipe(plumber())
		.pipe(concat('libs-and-custom.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 					// write to assets
		.pipe(size({
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
		.pipe(plumber())
		.pipe(concat('libs-and-custom.min.js'))			// concatenate them all to a file named app.js
		.pipe(gulp.dest(destJs)) 					// write to assets
		.pipe(size({
			title: 'js/libs-and-custom.min.js'
		}))
		.pipe(gzip())
		.pipe(gulp.dest(destJs)) 		// write app.js to assets/app.js
		.pipe(size({
			title: 'js/libs-and-custom.min.js.gz'
		}))
});

gulp.task('js-sequence', function() {
	runSequence(

	);
});



gulp.task('css-libs-size', function() {
	/*
	return gulp.src(assets.css.libs)
	.pipe(size({
		showFiles: true,
		title: "css libs"
	}))
	*/
});


gulp.task('css-custom-size', function() {
	return gulp.src(assets.css.files)
	.pipe(size({
		showFiles: true,
		title: "css files"
	}))
});
gulp.task('js-libs-size', function() {
	return gulp.src(assets.js.libs)
	.pipe(size({
		showFiles: true,
		title: "js libs"
	}))
});
gulp.task('js-custom-size', function() {
	return gulp.src(assets.js.files)
	.pipe(size({
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

gulp.task('package-sequence', function() {
	runSequence(
		//'css-libs',
		'css-custom',
		'css-libs-and-custom',
		'css-libs-and-custom-min',
		//'js-libs',
		'js-custom',
		'js-libs-and-custom',
		'js-libs-and-custom-min'
	);
});


gulp.task('watch-package-files', function() {
  gulp.watch(assets.js.files, ['package-sequence']);
  gulp.watch(assets.css.files, ['package-sequence']);
});

defaultTasks.push('package-sequence');
defaultTasks.push('watch-package-files');

/*
gulp.task('full-sequence', function() {
  runSequence(
    'angular-modules/book1-sass',
    'package-sequence'
  );
});
*/

/*
[
  'full-sequence',
  //'angular-modules/book1-sequence'
  //'angular-modules/book1-sass'
]
*/
gulp.task('default', defaultTasks);
