module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: ['assets/js/*.min.js']
			},
			all: ['Gruntfile.js', 'assets/js/*.js']
		},

		compass: {
			dist: {
				options: {
					sassDir: 'assets/sass',
					cssDir: 'assets/css',
					outputStyle: 'compressed'
				}
			}
		},

		watch: {
			css: {
				files: [
					'**/*.sass',
					'**/*.scss'
				],
				tasks: ['compass']
			},
			js: {
				files: [
					'assets/js/*.js',
					'Gruntfile.js'
				],
				tasks: ['jshint']
			}
		},

		coffee: {
			compile: {
				files : {
					'assets/js/' : 'assets/js/*.coffee'
				}
			}
		},
		
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
				'<%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target: {
				files: {
					'assets/js/main.min.js': ['assets/js/main.js']
				}
			}
		},

		browser_sync: {
			files: {
				src : [
					'assets/css/*.css',
					'assets/css/*.css',
					'assets/img/**/*.jpg',
					'assets/img/**/*.png',
					'assets/js/**/*.js',
					'**/*.php',
					'**/*.html'
				]
			},
			options: {
				watchTask: true
			}
		}
	});

	// Load the Grunt plugins.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-browser-sync');

	// Register the default tasks.
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('sync', ['browser_sync', 'watch']);
	grunt.registerTask('debug', ['jshint']);
};
