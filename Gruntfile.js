module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    manifest: grunt.file.readJSON('extension/manifest.json'),
    jshint: {
      files: ['extension/*.js'],
      options: {
        jshintrc: true
      }
    },
    jasmine: {
      src: ['extension/*.js'],
      options: {
        specs: 'tests/spec/*.spec.js',
        helpers: 'tests/spec/*.helper.js'
      }
    },
    run: {
      crxmake: {
        exec: [
          './crxmake.sh extension/ cert/key.pem',
          'mv extension.crx dist/<%= pkg.name %>-<%= manifest.version %>.crx'
        ].join(' && ')
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-run');

  grunt.registerTask('default', ['jshint', 'jasmine']);
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'run:crxmake']);

};
