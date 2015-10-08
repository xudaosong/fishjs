/**
 * 目标：
 * 1. 能按需生成脚本文件
 * 2. 每个模块能指定是否需要模板
 * 3. 配置自定义生成的文件路径和文件名
 * 4. demo也只生成自定义的模块
 */

/* jshint node: true */
var markdown = require('node-markdown').Markdown;
var fs = require('fs');

module.exports = function (grunt) {
    // 自动加载Grunt插件
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.util.linefeed = '\n';
    grunt.initConfig({
        srcDirectory: 'src',
        requires: [{
            name: '',
            dependency: 'carousel',
            file: 'bower_components/slick-carousel/slick/slick.js'
        }],
        modules: [],//to be filled in by build task
        pkg: grunt.file.readJSON('package.json'),
        dist: 'dist',
        filename: 'fish',
        meta: {
            modules: 'angular.module("fish", [<%= srcModules %>]);',
            tplmodules: 'angular.module("fish.tpls", [<%= tplModules %>]);',
            all: 'angular.module("fish", ["fish.tpls", <%= srcModules %>]);',
            banner: ['/*',
                ' * <%= pkg.name %>',
                ' * <%= pkg.homepage %>',
                ' * Version: <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
                ' * License: <%= pkg.license %>',
                ' */\n'].join('\n')
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'scss',
                    cssDir: '<%= dist %>',
                    outputStyle: 'expanded',
                    raw: 'on_stylesheet_saved do |file|\n' +
                    'if File.exists?(file)\n' +
                    'filename = File.basename(file, File.extname(file))\n' +
                    'File.rename(file, "<%= dist %>" + "/" + "<%= filename %>-<%= pkg.version %>" + File.extname(file))\n' +
                    'end\n' +
                    'end\n'
                }
            }
        },
        concat: {
            dist: {
                options: {
                    banner: '<%= meta.banner %><%= meta.all %>\n<%= meta.tplmodules %>\n'/*,
                     footer: '<%= meta.cssInclude %>'*/
                },
                src: [], //src filled in by build task
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.js'
            }
        },
        copy: {
            copyscss:{
                files:[{
                    expand: true,
                    src: ['**/**/*'],
                    cwd: 'scss',
                    dest: '<%= dist %>/scss'
                }]
            },
            copybower:{
                files:[{
                    src: ['bower.json'],
                    cwd: '.',
                    dest: '<%= dist %>/bower.json'
                }]
            },
            demohtml: {
                options: {
                    //process html files with gruntfile config
                    processContent: grunt.template.process
                },
                files: [{
                    expand: true,
                    src: ['**/*.html'],
                    cwd: 'misc/demo',
                    dest: '<%= dist %>/demo'
                }]
            },
            demoassets: {
                files: [{
                    expand: true,
                    //Don't re-copy html files, we process those
                    src: ['**/**/*', '!**/*.html'],
                    cwd: 'misc/demo',
                    dest: '<%= dist %>/demo'
                }]
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= concat.dist.dest %>'],
                dest: '<%= dist %>/<%= filename %>-<%= pkg.version %>.min.js'
            }
        },
        html2js: {
            dist: {
                options: {
                    module: null, // no bundle module for all the html2js templates
                    base: '.',
                    rename: function (moduleName) {
                        //console.log('html2js',moduleName);
                        return moduleName.replace(/(src|yczz)\//g, '');
                    }
                },
                files: [{
                    expand: true,
                    src: ['<%= srcDirectory %>/*/*.html'],
                    ext: '.html.js',
                    dest: '.tmp'
                }]
            }
        },
        watch: {
            css: {
                files: ['scss/**/*.scss'],
                tasks: ['compass'],
                options: {
                    livereload: true
                }
            },
            js: {
                files: ['<%= srcDirectory %>/*/*.*'],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            },
            demo: {
                files: ['<%= srcDirectory %>/*/docs/*.*', 'misc/demo/**/*.*'],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            }
        },
        ngdocs: {
            options: {
                dest: '<%= dist %>/docs',
                scripts: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-animate/angular-animate.js',
                    '<%= concat.dist_tpls.dest %>'
                ],
                styles: [
                    '<%= dist %>/<%= filename %>-<%= pkg.version %>.css'
                ],
                title: '<%= pkg.name %>',
                html5Mode: false
            },
            api: {
                src: ['src/**/*.js'],
                title: 'API Documentation'
            }
        }
    });


    //Common ui.bootstrap module containing all modules for src and templates
    //findModule: Adds a given module to config
    var foundModules = {};
    // 查找并生成模块配置
    function findModule(name, hasTpl) {
        if (foundModules[name]) {
            return;
        }
        foundModules[name] = true;
        if (hasTpl !== false)
            hasTpl = true;
        function breakup(text, separator) {
            return text.replace(/[A-Z]/g, function (match) {
                return separator + match;
            });
        }

        function ucwords(text) {
            return text.replace(/^([a-z])|\s+([a-z])/g, function ($1) {
                return $1.toUpperCase();
            });
        }

        // 添加双引号
        function enquote(str) {
            //str = str.replace(/src\//g, '');
            return '"' + str + '"';
        }

        // 替换基础路径 src 为 template
        function modifyPath(str) {
            return str.replace(/(src|yczz)\//g, '');
        }

        var srcDirectory = grunt.config('srcDirectory');
        var module = {
            name: name,
            moduleName: enquote('fish.' + name),
            displayName: 'fs' + ucwords(breakup(name, ' ')),
            srcFiles: grunt.file.expand(srcDirectory + '/' + name + '/*.js'),
            tplFiles: hasTpl ? grunt.file.expand(srcDirectory + '/' + name + '/*.html') : [],
            tpljsFiles: hasTpl ? grunt.file.expand('.tmp/' + srcDirectory + '/' + name + '/*.html.js') : [],
            tplModules: hasTpl ? grunt.file.expand(srcDirectory + '/' + name + '/*.html').map(enquote).map(modifyPath) : [],
            dependencies: dependenciesForModule(srcDirectory, name),
            docs: {
                md: grunt.file.expand(srcDirectory + '/' + name + '/docs/*.md')
                    .map(grunt.file.read).map(markdown).join('\n'),
                js: grunt.file.expand(srcDirectory + '/' + name + '/docs/*.js')
                    .map(grunt.file.read).join('\n'),
                html: grunt.file.expand(srcDirectory + '/' + name + '/docs/*.html')
                    .map(grunt.file.read).join('\n')
            }
        };

        module.dependencies.forEach(findModule);
        grunt.config('modules', grunt.config('modules').concat(module));
    }

    function dependenciesForModule(srcDirectory, name) {
        var deps = [];
        grunt.file.expand(srcDirectory + '/' + name + '/*.js')
            .map(grunt.file.read)
            .forEach(function (contents) {
                //Strategy: find where module is declared,
                //and from there get everything inside the [] and split them by comma
                var moduleDeclIndex = contents.indexOf('angular.module(');
                var depArrayStart = contents.indexOf('[', moduleDeclIndex);
                var depArrayEnd = contents.indexOf(']', depArrayStart);
                var dependencies = contents.substring(depArrayStart + 1, depArrayEnd);
                dependencies.split(',').forEach(function (dep) {
                    if (dep.indexOf('fish.') > -1) {
                        var depName = dep.trim().replace('fish.', '').replace(/['"]/g, '');
                        if (deps.indexOf(depName) < 0) {
                            deps.push(depName);
                            //Get dependencies for this new dependency
                            deps = deps.concat(dependenciesForModule(depName));
                        }
                    }
                });
            });
        return deps;
    }

    grunt.registerTask('test', 'test', function () {
        console.log(this.args);
        //grunt.file.expand({
        //    filter: 'isDirectory', cwd: '.'
        //}, '+(' + grunt.config('srcDirectory') + '|src)' + '/*').forEach(function (dir) {
        //    var modules = dir.split('/');
        //    console.log(modules[0], modules[1]);
        //});
    });
    // 第1，2个参数分别代表生成目录路径和文件名。第3个参数开始为模块名称，如果模块名称后面的参数是false，则该模块不需要默认模板，否则为需要默认模板
    // 如：grunt default:dist/yczz:fish-yczz:tab:false:popover
    // dist/yczz：代码生成到【dist/yczz】目录下
    // fish-yczz：文件名为【fish-yczz-版本号】
    // tab:false:popover：只需要生成tab和popover模块，其中tab模块不需要模板
    grunt.registerTask('default', 'build fish', function () {
        var _ = grunt.util._;

        // 如果有参数，第1个参数为产品名称，从第2个参数开始为模块名称
        if (this.args.length === 1) {
            grunt.config('dist', this.args[0]);
        } else if (this.args.length === 2) {
            grunt.config('dist', this.args[0]);
            grunt.config('filename', this.args[1]);
        } else if (this.args.length > 2) {
            grunt.config('dist', this.args[0]);
            grunt.config('filename', this.args[1]);
            var modules = this.args;
            modules.splice(0, 2);
            modules.forEach(function (item, index) {
                if (item === 'false')
                    return;
                var hasTpl = true;
                if (!!modules[index + 1] && modules[index + 1] === 'false') {
                    hasTpl = false;
                }
                findModule(item, hasTpl);
            });
        } else {
            grunt.file.expand({
                filter: 'isDirectory', cwd: '.'
            }, '+(' + grunt.config('srcDirectory') + ')' + '/*').forEach(function (dir) {
                var modules = dir.split('/');
                findModule(modules[1]);
            });
        }
        var modules = grunt.config('modules');
        var modulesName = _.pluck(modules, 'moduleName');
        //console.log(modules);
        // 引入第三方插件的模块名称
        grunt.config('requires').forEach(function (item) {
            if (!item.name)
                return;
            modules.forEach(function (module) {
                if (item.dependency.indexOf(module.name) >= 0) {
                    modulesName.splice(0, 0, '"' + item.name + '"');
                    return true;
                }
            });
        });
        grunt.config('srcModules', modulesName);
        grunt.config('tplModules', _.pluck(modules, 'tplModules').filter(function (tpls) {
            return tpls.length > 0;
        }));
        grunt.config('demoModules', modules
                .filter(function (module) {
                    return module.docs.md && module.docs.js && module.docs.html;
                })
                .sort(function (a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
        );

        var moduleFileMapping = _.clone(modules, true);
        moduleFileMapping.forEach(function (module) {
            delete module.docs;
        });
        grunt.config('moduleFileMapping', moduleFileMapping);

        var srcFiles = _.pluck(modules, 'srcFiles');
        var tpljsFiles = _.pluck(modules, 'tpljsFiles');
        // 引入第三方插件的源文件
        grunt.config('requires').forEach(function (item) {
            modules.forEach(function (module) {
                if (item.dependency.indexOf(module.name) >= 0) {
                    srcFiles[0].splice(0, 0, item.file);
                    return true;
                }
            });
        });
        //Set the concat task to concatenate the given src modules
        grunt.config('concat.dist.src', grunt.config('concat.dist.src').concat(srcFiles).concat(tpljsFiles));
        grunt.task.run(['concat', 'html2js', 'compass:dist', 'concat', 'uglify', 'copy']);

    });
    //grunt.registerTask('build', 'build fish', ['modules', 'html2js', 'compass:dist', 'concat', 'uglify', 'copy']);

    //grunt.registerTask('makeModuleMappingFile', function () {
    //    var _ = grunt.util._;
    //    var moduleMappingJs = 'dist/assets/module-mapping.json';
    //    var moduleMappings = grunt.config('moduleFileMapping');
    //    var moduleMappingsMap = _.object(_.pluck(moduleMappings, 'name'), moduleMappings);
    //    var jsContent = JSON.stringify(moduleMappingsMap);
    //    grunt.file.write(moduleMappingJs, jsContent);
    //    grunt.log.writeln('File ' + moduleMappingJs.cyan + ' created.');
    //});

    //grunt.registerTask('makeRawFilesJs', function () {
    //    var _ = grunt.util._;
    //    var jsFilename = 'dist/assets/raw-files.json';
    //    var genRawFilesJs = require('./misc/raw-files-generator');
    //
    //    genRawFilesJs(grunt, jsFilename, _.flatten(grunt.config('concat.dist_tpls.src')),
    //        grunt.config('meta.banner'), grunt.config('meta.cssFileBanner'));
    //});

    /**
     * Logic from AngularJS
     * https://github.com/angular/angular.js/blob/36831eccd1da37c089f2141a2c073a6db69f3e1d/lib/grunt/utils.js#L121-L145
     */
    //function processCSS(state, minify, file) {
    //    /* jshint quotmark: false */
    //    var css = fs.readFileSync(file).toString(),
    //        js;
    //    state.css.push(css);
    //
    //    if (minify) {
    //        css = css
    //            .replace(/\r?\n/g, '')
    //            .replace(/\/\*.*?\*\//g, '')
    //            .replace(/:\s+/g, ':')
    //            .replace(/\s*\{\s*/g, '{')
    //            .replace(/\s*\}\s*/g, '}')
    //            .replace(/\s*\,\s*/g, ',')
    //            .replace(/\s*\;\s*/g, ';');
    //    }
    //    //escape for js
    //    css = css
    //        .replace(/\\/g, '\\\\')
    //        .replace(/'/g, "\\'")
    //        .replace(/\r?\n/g, '\\n');
    //    js = "!angular.$$csp() && angular.element(document).find('head').prepend('<style type=\"text/css\">" + css + "</style>');";
    //    state.js.push(js);
    //
    //    return state;
    //}

    //function setVersion(type, suffix) {
    //    var file = 'package.json';
    //    var VERSION_REGEX = /([\'|\"]version[\'|\"][ ]*:[ ]*[\'|\"])([\d|.]*)(-\w+)*([\'|\"])/;
    //    var contents = grunt.file.read(file);
    //    var version;
    //    contents = contents.replace(VERSION_REGEX, function (match, left, center) {
    //        version = center;
    //        if (type) {
    //            version = require('semver').inc(version, type);
    //        }
    //        //semver.inc strips our suffix if it existed
    //        if (suffix) {
    //            version += '-' + suffix;
    //        }
    //        return left + version + '"';
    //    });
    //    grunt.log.ok('Version set to ' + version.cyan);
    //    grunt.file.write(file, contents);
    //    return version;
    //}
    //
    //grunt.registerTask('version', 'Set version. If no arguments, it just takes off suffix', function () {
    //    setVersion(this.args[0], this.args[1]);
    //});
    //
    //grunt.registerMultiTask('shell', 'run shell commands', function () {
    //    var self = this;
    //    var sh = require('shelljs');
    //    self.data.forEach(function (cmd) {
    //        cmd = cmd.replace('%version%', grunt.file.readJSON('package.json').version);
    //        grunt.log.ok(cmd);
    //        var result = sh.exec(cmd, {silent: true});
    //        if (result.code !== 0) {
    //            grunt.fatal(result.output);
    //        }
    //    });
    //});

    return grunt;
};