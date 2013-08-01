var fs = require("fs");

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    pkg: pkg,

    browserify: {
      basic: {
        src: ['lib/scalpel.js'],
        dest: 'build/scalpel-<%=pkg.version%>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! ScalpelJS v.<%=pkg.version%> */\n'
      },
      build: {
        src: 'build/scalpel-<%=pkg.version%>.js',
        dest: 'build/scalpel-<%=pkg.version%>.min.js'
      }
    },

    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            pkg: pkg
          }
        },
        files: {
          "index.html": "pages/index.jade"
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');

  grunt.registerTask('default', ['browserify', 'uglify', 'jade']);

};