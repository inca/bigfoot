var fs = require("fs")
  , rho = require("rho");

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    pkg: pkg,

    browserify: {
      basic: {
        src: ['client/bundle.js'],
        dest: 'build/bigfoot-<%=pkg.version%>.js'
      },
      noinit: {
        src: ['client/bundle-noinit.js'],
        dest: 'build/bigfoot-noinit-<%=pkg.version%>.js'
      },
      amd: {
        src: ['client/bundle-amd.js'],
        dest: 'build/bigfoot-amd-<%=pkg.version%>.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! Bigfoot v.<%=pkg.version%> */\n'
      },
      basic: {
        src: 'build/bigfoot-<%=pkg.version%>.js',
        dest: 'build/bigfoot-<%=pkg.version%>.min.js'
      },
      noinit: {
        src: 'build/bigfoot-noinit-<%=pkg.version%>.js',
        dest: 'build/bigfoot-noinit-<%=pkg.version%>.min.js'
      },
      amd: {
        src: 'build/bigfoot-amd-<%=pkg.version%>.js',
        dest: 'build/bigfoot-amd-<%=pkg.version%>.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};