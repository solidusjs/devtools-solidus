module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['*.js', 'views/*.js'],
      options: {
        jshintrc: true
      }
    },
    jasmine: {
      src: ['background.js', 'main.js', 'views/*.js'],
      options: {
        specs: 'tests/spec/*.spec.js',
        helpers: 'tests/spec/*.helper.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('default', ['jshint', 'jasmine']);
  grunt.registerTask('test', ['jshint', 'jasmine']);

};
