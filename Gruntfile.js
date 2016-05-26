module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            options: {
               transform: [['babelify', {presets: ['es2015', 'react']}]]
            },
            views: {
              files: [{
                expand: true,
                cwd: 'public/views/',
                src: ['**/*.jsx'],
                dest: 'public/views/',
                ext: '.js'
              }]
            }
        },
        copy: {
          main: {
            files: [
              {
                expand: true, cwd: './node_modules/bootstrap/',
                src: ['js/**', 'less/**'], dest: './public/vendor/bootstrap/'
              },
              {
                expand: true, cwd: './node_modules/semantic-ui/dist/',
                src: ['semantic.css', 'semantic.js'], dest: './public/vendor/semantic/'
              },
              {
                expand: true, cwd: './node_modules/jquery/dist/',
                src: ['jquery.js'], dest: './public/vendor/jquery/'
              },
              {
                expand: true, cwd: './node_modules/fittext.js/',
                src: ['jquery.fittext.js'], dest: './public/vendor/fittext/'
              },
              {
                expand: true, cwd: './node_modules/react/dist/',
                src: ['react.js'], dest: './public/vendor/react/'
              },
              {
                expand: true, cwd: './node_modules/react-dom/dist/',
                src: ['react-dom.js'], dest: './public/vendor/react-dom/'
              },
/*
              {
                expand: true, cwd: 'node_modules/font-awesome/',
                src: ['fonts/**', 'less/**'], dest: 'public/vendor/font-awesome/'
              },
              {
                expand: true, cwd: 'node_modules/html5shiv/dist/',
                src: ['html5shiv.js'], dest: 'public/vendor/html5shiv/'
              },
              {
                expand: true, cwd: 'node_modules/jquery.cookie/',
                src: ['jquery.cookie.js'], dest: 'public/vendor/jquery.cookie/'
              },
              {
                expand: true, cwd: 'node_modules/moment/',
                src: ['moment.js'], dest: 'public/vendor/momentjs/'
              },
              {
                expand: true, cwd: 'node_modules/respond.js/src/',
                src: ['respond.js'], dest: 'public/vendor/respond/'
              },
              {
                expand: true, cwd: 'node_modules/underscore/',
                src: ['underscore.js'], dest: 'public/vendor/underscore/'
              }
*/
            ]
          },
          blog: {
            files: [
              {
                expand: true, cwd: './public/vendor/bootstrap/', 
                src: ['bootstrap.js'], dest: './linkgoBlog/themes/bootstrap-blog/source/js/'
              },
              {
                expand: true, cwd: './public/views/home/',
                src: ['home.js'], dest: './linkgoBlog/themes/bootstrap-blog/source/js/'
              },
              {
                expand: true, cwd: './node_modules/jquery/dist/',
                src: ['jquery.js'], dest: './linkgoBlog/themes/bootstrap-blog/source/js/'
              },
              {
                expand: true, cwd: './node_modules/fittext.js/',
                src: 'jquery.fittext.js', dest: './linkgoBlog/themes/bootstrap-blog/source/js/',
              },
            ]
          },
        },
        uglify: {
            options: {
              sourceMap: true,
              sourceMapName: function(filePath) {
                return filePath + '.map';
              }
            },
            views: {
                files: [{
                  expand: true,
                  cwd: 'public/views/',
                  src: ['**/*.js', '!**/*.min.js'],
                  dest: 'public/views/',
                  ext: '.min.js'
                }]
            }
        },
        less: {
            options: {
              compress: true
            },
            layouts: {
              files: {
                  "./linkgoBlog/themes/bootstrap-blog/source/css/linkgo-blog.css": [
                    "./linkgoBlog/themes/bootstrap-blog/source/css/linkgo-blog.less"
                  ]
              }
            },
            views: {
              files: [{
                expand: true,
                cwd: 'public/views/',
                src: ['**/*.less'],
                dest: 'public/views/',
                ext: '.css'
              }]
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2013-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: [
                      './public/layouts/linkgo.min.css',
                      './public/layouts/linkgo.min.js'
                    ]
                }
            }
        },
        concurrent: {
          dev: {
            tasks: ['nodemon', 'watch'],
            options: {
              logConcurrentOutput: true
            }
          }
        },
        nodemon: {
          dev: {
            script: 'app.js',
            options: {
              ignore: [
                'node_modules/**',
                'public/**'
              ],
              ext: 'js'
            }
          }
        },
        watch: {
            jsx: {
              files: [
                  'public/views/**/*.jsx'
              ],
              tasks: ['newer:browserify']
            },
            clientJS: {
                files: [
                  'public/layouts/**/*.js', '!public/layouts/**/*.min.js',
                  'public/views/**/*.js', '!public/views/**/*.min.js'
                ],
                tasks: ['uglify'],
            },
            serverJS: {
               files: ['views/**/*.js'],
               tasks: ['newer:jshint:server']
            },
            allLess: {
                files: [
                  './public/layouts/**/*.less',
                  './public/views/**/*.less',
                  './linkgoBlog/themes/bootstrap-blog/source/css/*.less'
                ],
                tasks: ['newer:less'],
                options: {
                    spawn: false,
                }
            },
        },
        jshint: {
          client: {
            options: {
              jshintrc: '.jshintrc-client',
              ignores: [
                'public/layouts/**/*.min.js',
                'public/views/**/*.min.js'
              ]
            },
            src: [
              'public/layouts/**/*.js',
              'public/views/**/*.js'
            ]
          },
          server: {
            options: {
              jshintrc: '.jshintrc-server'
            },
            src: [
              'views/**/*.js'
            ]
          }
        },
        clean: {
          js: {
            src: [
              'public/layouts/**/*.min.js',
              'public/layouts/**/*.min.js.map',
              'public/views/**/*.min.js',
              'public/views/**/*.min.js.map'
            ]
          },
          css: {
            src: [
              'public/layouts/**/*.min.css',
              'public/views/**/*.min.css'
            ]
          },
          vendor: {
            src: ['public/vendor/**']
          }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-browserify');


    // Default task(s).
    grunt.registerTask('default', ['newer:browserify', 'copy', 'newer:uglify', 'newer:less', 'usebanner', 'concurrent']);

};
