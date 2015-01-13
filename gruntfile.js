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
      uerCss: {
        files: {
          'public/stylesheets/blog.min.css': ['public/stylesheets/style.css','public/stylesheets/layout.less','public/stylesheets/blog.less','public/stylesheets/user.less','public/stylesheets/common.less','public/stylesheets/octicons/octicons.less']
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
        src: ['blog.min.js','plugins.min.js'],
        dest: 'public/javascripts'
      }
    },
    less: {
      options: {
        compress: true,
        banner: '/*! renjm blog <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      pluginCss: {
        files: {
          'public/stylesheets/plugins.min.css': 'public/stylesheets/plugin.less'
        }
      },
      userCss: {
        files: {
          'public/stylesheets/blog.min.css': 'public/stylesheets/blog.min.css'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.registerTask('default', ['concat','uglify','less']);
  grunt.registerTask('develop', ['concat','less']);

};