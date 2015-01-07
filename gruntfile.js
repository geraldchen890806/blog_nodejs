module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      plugins: {
        options: {
          separator: '\n'
        },
        files: {
          'public/javascripts/plugins.min.js': ['public/javascripts/plugins/plugin.js','public/javascripts/plugins/dropdown.js','public/javascripts/plugins/editor.js']
        }
      },
      user: {
        files: {
          'public/javascripts/blog.min.js': 'public/javascripts/blog.js'
        }
      },
      css: {
        files: {
          'public/stylesheets/blog.min.css': ['public/stylesheets/style.css','public/stylesheets/layout.css','public/stylesheets/common.css','public/stylesheets/blog.css','public/stylesheets/user.css','public/stylesheets/octicons/octicons.css']
        }
      },
      pluginCss: {
        files: {
          'public/stylesheets/plugins.min.css': 'public/stylesheets/plugin.css'
        }
      }

    },
    uglify: {
      options: {
        mangle: false,
        banner: '/*! renjm blog <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      files: {
        expand: true,
        cwd:'public/javascripts',
        src:'*.min.js',
        dest: 'public/javascripts'
      }
    },
    cssmin: {
      files: {
        expand: true,
        cwd:'public/stylesheets',
        src:'*.min.css',
        dest: 'public/stylesheets'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['concat','uglify','cssmin']);
};