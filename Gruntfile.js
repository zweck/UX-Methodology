module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/js/vendor/jquery.js', 'src/js/vendor/*.js','src/js/foundation/foundation.js','src/js/foundation/*.js','src/js/*.js'],
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['gruntfile.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    compass: {
      dist: {
        options: {
          imagesDir: 'src/img',
          sassDir: 'src/sass',
          cssDir: 'dist/stylesheets',
          outputStyle: 'expanded',
          relativeAssets: false
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/img', src: ['**'], dest: 'dist/img', filter: 'isFile'},
          {expand: true, cwd: 'src/font', src: ['**'], dest: 'dist/font', filter: 'isFile'},
          {expand: true, cwd: 'src/assets', src: ['**'], dest: 'dist/assets', filter: 'isFile'},
          {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist/', filter: 'isFile'}
        ]
      }
    },
    exec: {
      growl: {
        cmd: function(message) {
          return 'growlnotify -m "' + message + '"';
        }
      }
    },
    jade: {
        compile: {
            files: [
                {
                    expand: true,
                    cwd: "src/",
                    src: ["**/*.jade"],
                    dest: "dist/",
                    ext: ".html"
                }
            ]
        }
    },
    'gh-pages': {
      options: {
          base: 'dist'
      },
        src: ['**']
    },
    watch: {
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['exec:growl:js', 'js', 'exec:growl:reloading', 'reload'],
        options: {
          interrupt: true
        }
      },
      scss: {
        files: ['src/sass/**/*.scss'],
        tasks: ['exec:growl:sass', 'sass', 'exec:growl:reloading', 'reload'],
        options: {
          interrupt: true
        }
      },
      images: {
        files: ['src/img/*'],
        tasks: ['exec:growl:images', 'copy', 'exec:growl:reloading', 'reload'],
        options: {
          interrupt: true
        }
      },
      jade: {
        files: ['src/**/*.jade', 'src/posts.*.jade'],
        tasks: ['exec:growl:jade', 'jade', 'exec:growl:reloading', 'reload'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['jade', 'jshint', 'concat', 'uglify', 'images', 'compass']);
  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('sass', ['compass']);
  grunt.registerTask('images', ['copy']);


  grunt.registerTask("reload", "reload Chrome on OS X",
      function() {
    require("child_process").exec("osascript " +
        "-e 'tell application \"Google Chrome\" " +
          "to tell the active tab of its first window' " +
        "-e 'reload' " +
        "-e 'end tell'");
  });

};