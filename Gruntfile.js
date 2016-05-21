module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            main: {
                src: 'public/javascripts/linkgo.js',
                dest: 'public/javascripts/linkgo.min.js'
            }
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "public/stylesheets/linkgo.css": "public/stylesheets/linkgo.less",
                    "./linkgoBlog/themes/bootstrap-blog/source/css/linkgo-blog.css": "./linkgoBlog/themes/bootstrap-blog/source/css/linkgo-blog.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"],
                    cleancss: true
                },
                files: {
                    "public/stylesheets/linkgo.min.css": "public/stylesheets/linkgo.less"
                }
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
                    src: ['public/stylesheets/linkgo.css', 'public/stylesheets/linkgo.min.css', 'public/javascripts/linkgo.min.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['public/javascripts/linkgo.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['public/stylesheets/*.less', './linkgoBlog/themes/bootstrap-blog/source/css/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'usebanner', 'watch']);

};
