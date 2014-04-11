var fs = require("fs")
  , rho = require("rho");

module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    pkg: pkg,

    browserify: {
      basic: {
        src: ['client/bundle/init.js'],
        dest: 'build/bigfoot-init.js'
      },
      noinit: {
        src: ['client/bundle/noinit.js'],
        dest: 'build/bigfoot-noinit.js'
      },
      amd: {
        src: ['client/bundle/amd.js'],
        dest: 'build/bigfoot-amd.js',
        options: {
          standalone: 'bigfoot'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! Bigfoot v.<%=pkg.version%> */\n'
      },
      basic: {
        src: 'build/bigfoot-init.js',
        dest: 'build/bigfoot-init.min.js'
      },
      noinit: {
        src: 'build/bigfoot-noinit.js',
        dest: 'build/bigfoot-noinit.min.js'
      },
      amd: {
        src: 'build/bigfoot-amd.js',
        dest: 'build/bigfoot-amd.min.js'
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);

};