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
      }
    },

    uglify: {
      options: {
        banner: '/*! Bigfoot v.<%=pkg.version%> */\n'
      },
      build: {
        src: 'build/bigfoot-<%=pkg.version%>.js',
        dest: 'build/bigfoot-<%=pkg.version%>.min.js'
      }
    },

    jade: {
      compile: {
        options: {
          pretty: true,
          data: {
            pkg: pkg,
            rho: function(file) {
              var text = fs.readFileSync(file, { encoding: 'utf-8' });
              return rho.toHtml(text);
            }
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