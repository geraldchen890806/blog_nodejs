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
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/*! renjm blog <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      files: {
        expand: true,
        cwd:'public/javascripts',
        src: ['blog.min.js','plugins.min.js'],
        dest: 'public/javascripts'
      }
    },
    less: {
      css: {
        files: {
          'public/stylesheets/blog.min.css': ['public/stylesheets/style.css','public/stylesheets/layout.less','public/stylesheets/blog.less','public/stylesheets/user.less','public/stylesheets/common.less','public/stylesheets/octicons/octicons.less']
        }
      },
      pluginCss: {
        files: {
          'public/stylesheets/plugins.min.css': 'public/stylesheets/plugin.less'
        }
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['concat','uglify','less','cssmin']);
};