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
                expand: true, cwd: './AdminLTE/bootstrap/',
                src: ['**/**'], dest: './public/vendor/bootstrap/'
              },
              {
                expand: true, cwd: './AdminLTE/dist/',
                src: ['**/**'], dest: './public/vendor/AdminLTE/dist/'
              },
              {
                expand: true, cwd: './node_modules/semantic-ui/dist/',
                src: ['semantic.css', 'semantic.js', 'themes/default/assets/fonts/icons.*' ], dest: './public/vendor/semantic/'
              },
              {
                expand: true, cwd: './node_modules/jquery/dist/',
                src: ['**/**'], dest: './public/vendor/jquery/'
              },
              {
                expand: true, cwd: './node_modules/jquery.cookie/',
                src: ['jquery.cookie.js'], dest: './public/vendor/jquery.cookie/'
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
                files: [
                  'views/**/*.js',
                  './utils/**/*.js',
                ],
                tasks: ['newer:jshint:server']
            },
            allLess: {
                files: [
                  './public/layouts/**/*.less',
                  './public/views/**/*.less',
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
    grunt.registerTask('default', ['newer:browserify', 'copy', 'newer:uglify', 'newer:less', 'concurrent']);

};
