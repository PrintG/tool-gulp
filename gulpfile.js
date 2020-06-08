var gulp = require('gulp'),
    revC = require('gulp-rev-collector'),   // 重构文件内的路径引用
    // RevAll = require('gulp-rev-all'),   // 清除缓存，重构文件名
    rev = require('gulp-rev'),
    cssMin = require('gulp-clean-css'), //css压缩
    rename = require('gulp-rename'),    //重命名
    uglify = require('gulp-uglify'),    //js压缩
    clearAll = require('del');  //删除文件

var through2 = require('through2');
    

//开发构建

//定义特殊文件(图片，字体文件等,会在任务开始前就移入至min文件夹)
var resource = [
    "web/**/*",
    "!web/**/*.js",
    "!web/**/*.css",
    "!web/**/*.html",
];
var resource2 = [
    "web/**/lib/**/*",
    "web/**/js/lib/*",
    "web/**/html5shiv.js"
]
var nogou = [
    "!web/lib/**/*",
    "!web/js/lib/**/*",
    "!web/js/html5shiv.js",
];

//定义css、js、html源文件路径
var cssSrc = ['web/**/*.css'],
    jsSrc = ['web/**/*.js'];

cssSrc = cssSrc.concat(nogou);
jsSrc = jsSrc.concat(nogou);

//将除了css,js,html 的资源先移入至目标目录
gulp.task('moveResource', function() {
    return gulp.src(resource)
    .pipe(gulp.dest('min'))
});
gulp.task('moveResource2', function() {
    return gulp.src(resource2)
    .pipe(gulp.dest('min'))
});

// css打版本
gulp.task('revCss', function() {
    return gulp.src(cssSrc)       //指定获取到src下的所有css文件。
        .pipe(cssMin({
            compatibility: 'ie8',    //兼容IE8
            rebase: false  //禁用引用路径重新定位，避免定位后找不到该文件问题
        }))     //执行压缩操作
        .pipe(rev())
        .pipe(gulp.dest('min'))
        .pipe(rev.manifest())
        // .pipe(rev.revision({ hashLength: 10 }))
        // .pipe(gulp.dest('min'))
        // .pipe(RevAll.manifestFile())
        .pipe(rename({     //重命名
            suffix: '.css'
        }))
        .pipe(gulp.dest('min'));//生成目标压缩css文件
});

// js打版本
gulp.task('revJs',function () {
    return gulp.src(jsSrc)        //指定获取到src下的所有js文件。
        .pipe(uglify())         //执行压缩操作
        .pipe(rev())
        .pipe(gulp.dest('min'))
        .pipe(rev.manifest())
        // .pipe(RevAll.revision({hashLength: 10 }))
        // .pipe(gulp.dest('min'))
        // .pipe(RevAll.manifestFile())
        .pipe(rename({
            suffix: '.js'
        }))
        .pipe(gulp.dest('min'));//生成目标压缩js文件
});

//Html替换css、js引用文件版本
gulp.task('revHtml', function () {
    return gulp.src(['min/*.json', 'web/**/*.html',"min/**/*.js"])
        .pipe(revC())
        .pipe(gulp.dest('min'));
});

//清空dist文件夹
gulp.task('clearAll', function () {
    return clearAll('min');
});

gulp.task('dev', gulp.series('moveResource',"moveResource2",'revCss','revJs','revHtml'));

// 开发js、css打版本入口
gulp.task('g', gulp.series('clearAll','dev',function(){}));


/*
.pipe(through2.obj(function (file, enc, cb) {

        console.log(file.relative); // 文件路径
        cb();
        }))
*/ 