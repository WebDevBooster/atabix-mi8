module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: ['components/foundation/scss', 'components/atabix-mi8/scss']
            },
            dist: {
                options: {
                    outputStyle: 'expanded',
                    sourcemap: 'true'
                },
                files: [{
                    'css/style.css': ['scss/style.scss']
                }, {
                    'css/mi.css': ['scss/mi.scss']
                }]
            }
        },

        watch: {
            grunt: { files: ['Gruntfile.js'] },
            sass: {
                files: 'scss/**/*.scss',
                tasks: ['sass', 'autoprefixer'],
            },
            options: {
                // Start a live reload server on the default port 35729
                livereload: true
            }
        },

        autoprefixer: {
            options: {
                browsers: ['last 15 versions']
            },
            dist: { // Target
                files: {
                    'css/style.css': 'css/style.css',
                    'css/mi.css': 'css/mi.css'
                }
            },
        },

        cssmin: {
            combine: {
                files: [{
                    'css/style.min.css': ['css/style.css']
                }, {
                    'css/mi.min.css': ['css/mi.css']
                }]
            }
        },

        // Give IE9 some swag when dealing with large CSS files.
        bless: {
            css: {
                options: {
                    compress: true,
                    force: true,
                    warnLimit: 4000,
                    logCount: true
                },
                files: {
                    'css/style.blessed.css': 'css/style.min.css'
                }
            }
        },


        uglify: {
            my_target: {
                options: {
                    mangle: false
                },
                files: [
                    {
                        'js/atabix-mi8.min.js': [
                              'components/fastclick/lib/fastclick.js'
                            , 'components/jquery-form/jquery.form.js'
                            , 'components/atabix-sweetalert/lib/sweet-alert.js'
                            , 'components/select2/select2.min.js'
                            , 'components/mousetrap/mousetrap.min.js'
                            , 'components/matchHeight/jquery.matchHeight-min.js'
                            , 'components/tooltipster/js/jquery.tooltipster.min.js'
                            , 'components/jquery-minicolors/jquery.minicolors.min.js'
                            , 'js/lib/jquery.nicescroll.min.js'
                            , 'js/lib/classie.js'
                            , 'js/lib/sidebarEffects.js'
                            , 'js/lib/modalEffects.js'
                            , 'js/toggleSidepanel.js'
                            , 'js/elementPanel-collapse.js'
                            , 'js/notification-collapse.js'
                            , 'js/offcanvasToggle.js'
                            , 'js/globalSearch.js'
                            , 'js/fixedHeight.js'
                            , 'js/autosave.js'

                            , 'js/init.js'
                        ]
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-bless');

    grunt.registerTask('build', ['sass:dist', 'autoprefixer', 'cssmin', 'bless', 'uglify']);
    grunt.registerTask('composer', ['build']);
    grunt.registerTask('js', ['uglify'] );

    grunt.registerTask('default', ['sass:dist', 'autoprefixer', 'watch']);

}
