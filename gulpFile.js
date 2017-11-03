var gulp = require('gulp');
var browserSync = require('browser-sync');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var imagemin = require('gulp-imagemin');
var jsvalidate = require('gulp-jsvalidate');
var changed = require('gulp-changed');
var sequence = require('run-sequence');
var twig = require('gulp-twig');
var inject = require('gulp-inject');
var spritesmith = require('gulp.spritesmith');
var del = require('del');
var color = require('gulp-color');
const babel = require('gulp-babel');

var config = {
    public: 'public/',
    src: 'src/',
    twigIn: 'src/templates/*.twig',
    twigInAll: 'src/templates/**/*.twig',
    scssIn: 'src/scss/**/*.scss',
    imgIn: 'src/img/**/*.*',
    imgInNoSprite: '!src/img/sprite/*.*',
    jsIn: 'src/js/**/*.js',
    spriteImgIn: 'src/img/sprite/*.{jpg,png}',
    spriteAll: 'src/img/sprite/*',

    cssOut: 'public/css/',
    jsOutAll: 'public/js/**/*.js',
    jsOut: 'public/js/',
    jsConcatFiles: [
        'node_modules/jquery/dist/jquery.min.js',
        'src/js/scripts.js'
    ],
    imgOut: 'public/img/',
    spriteImgOut: 'src/img/sprite-compressed/',
    spriteScssOut: 'src/scss/global/',
    spriteImgPath: 'img/sprite-compressed/sprite.png',

    spriteImgName: 'sprite.png',
    spriteScssName: '_sprite.scss',
    css: 'main.css',
    htmlAll: '*.html'

};

gulp.task('fonts', function () {
    return gulp.src('src/assets/*')
        .pipe(gulp.dest('public/assets'))
});

gulp.task('twig', function() {
    return gulp.src(config.twigIn)
        .pipe(twig())
        .pipe(inject(gulp.src(config.cssOut + config.css, {read: true}), {
            ignorePath : config.public,
            addRootSlash: false}))

        // .pipe(inject(gulp.src(['../public/js/vendor/modernizr-2.6.2-respond-1.1.0.min.js'], {read: false}), {
        //     ignorePath : config.public,
        //     addRootSlash : false,
        //     name: 'head'}))

        .pipe(inject(gulp.src('public/js/scripts.js', {read: false}), {
            ignorePath : config.public,
            addRootSlash : false}))

        .pipe(gulp.dest(config.public));
        // .pipe(browserSync.stream());

});

gulp.task('sass', function(){
    return gulp.src(config.scssIn)
        .pipe(sourcemaps.init())
        // .pipe(concat('style.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 3 versions']
        }))
        .pipe(sourcemaps.write())
        // .pipe(cleanCSS())
        .pipe(gulp.dest(config.cssOut))
        .pipe(browserSync.stream());
});

gulp.task('css:minify', function(){
   return gulp.src('public/css/main.css')
       .pipe(cleanCSS())
       .pipe(gulp.dest(config.cssOut))
});

gulp.task('img', function() {
    return gulp.src([config.imgIn, config.imgInNoSprite])
        .pipe(changed(config.imgOut))
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}]
        }))
        .pipe(gulp.dest(config.imgOut));
});


gulp.task('js', function() {
    return gulp.src(config.jsConcatFiles)
        .pipe(jsvalidate())
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.jsOut))
        .pipe(browserSync.stream());
});

gulp.task('js:minify', function() {
    return gulp.src('public/js/scripts.js')
        .pipe(uglify())
        .pipe(gulp.dest(config.jsOut))
});

gulp.task('sprite', function () {
    var spriteData = gulp.src(config.spriteImgIn)
        .pipe(spritesmith({
            imgName: config.spriteImgName,
            cssName: config.spriteScssName,
            imgPath: config.spriteImgPath,
            padding: 2,
            cssVarMap: function(sprite) {
                sprite.name = 'icon-' + sprite.name
            }
        }));
    spriteData.img.pipe(gulp.dest(config.spriteImgOut));
    spriteData.css.pipe(gulp.dest(config.spriteScssOut));
});

gulp.task('clean', function () {
    return del(['public']);
});

gulp.task('reload', function() {
    browserSync.reload();
});

gulp.task('serve', function() {

    sequence(['sprite'], ['sass'], ['js'], ['twig'], ['img'], ['fonts'], ['reload']);
    browserSync({
        server: config.public,
        port: 3010
    });
    gulp.watch(config.spriteAll, ['sprite']);
    gulp.watch(config.scssIn, ['sass']);
    gulp.watch(config.jsIn, ['js']);
    gulp.watch(config.twigInAll, ['twig']);
    gulp.watch(config.imgIn, ['img']);
    gulp.watch(config.public + config.htmlAll).on('change', browserSync.reload);

});

gulp.task('watch', function() {

    sequence(['sprite'], ['sass'], ['js'], ['twig'], ['img'], ['fonts']);

    gulp.watch(config.spriteAll, ['sprite']);
    gulp.watch(config.scssIn, ['sass']);
    gulp.watch(config.jsIn, ['js']);
    gulp.watch(config.twigInAll, ['twig']);
    gulp.watch(config.imgIn, ['img']);
});

gulp.task('minify', function() {
    sequence('js:minify', 'css:minify')
});

gulp.task('build', function () {
    sequence('clean', ['sprite'], ['sass'], ['js'], ['twig'], ['img'], ['fonts'])
});

gulp.task('default', function() {

    function taskData( name, description) {
        console.log( color('gulp ' + name, 'RED') + ' - ' + color(description, 'YELLOW'));
    }

    console.log(color('\n \tLista wszystkich tasków:\n', 'RED'));

    taskData('sass',  'Kompiluje sassy do cssow');
    taskData('js',  'Kompiluje jsy katalogu public + sprawdza poprawnosc skryptow');
    taskData('twig',  'Kompiluje twigi do HTML');
    taskData('img',  'Kompresuje wszystkie zdjęcia z katalogu img');
    taskData('sprite',  'Pobiera wszystkie pliki z katalogu "src/img/sprite" i tworzy sprite do fonlderu "src/img/sprite-compressed"');

    console.log('');

    taskData('watch',  'Sprawdza czy sa w projekcie jakies zmiany i kompiluje elementy zmienione');
    taskData('serve',  'To samo co watch + BrowerSync');

    console.log('');

});