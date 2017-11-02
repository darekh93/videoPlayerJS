
$(function () {
    $('#fullpage').fullpage({
        anchors: ['transport-dalekobiezny', 'transport-miejski', 'przewozy-objetosciowe', 'branza-budowlana', 'branza-kamieniarska', 'branza-ogrodnicza', 'branza-komunalna'],
        navigationTooltips: ['Transport dalekobieżny', 'Transport miejski', 'Przewozy objętościowe', 'Branża budowlana', 'Branża kamieniarska', 'Branża ogrodnicza', 'Branża komunalna'],

        // sectionsColor: ['#1bbc9b', '#4BBFC3', '#7BAABE', 'whitesmoke', '#ccddff'],
        menu: '#menu',
        scrollingSpeed: 1000,
        navigation: true,
        navigationPosition: 'right',
        showActiveTooltip: true,
        // responsiveWidth: 1200,
        // responsiveHeight: 600,
        // responsiveSlides: true,
        scrollOverflow: true,

        afterResponsive: function(isResponsive){
            // alert("Is responsive: " + isResponsive);
        },

        afterLoad: function(){
            var loadedSection = $(this);

            var allSections = $('.fp-section .outside__content');
            allSections.removeClass('show');

            var contentButtons = loadedSection.find('.content__buttons li');

            var contentLeftDesc = $('.content__description');
            var hybridVersionText = $('.hybrid-version-text');

            $.each( contentButtons, function () {
                var outsideContent = loadedSection.find('.outside__content');
                $(this).click(function() {
                    var contentButtonsData = $(this).data('content');
                    $.each(outsideContent, function () {
                        if(contentButtonsData === $(this).data('content')) {
                            outsideContent.removeClass('show');
                            $(this).addClass('show')
                            if(loadedSection.find('.outside__content').hasClass('show')){
                                $('#fp-nav').addClass('hidden');
                            }
                        }
                        if(contentButtonsData === 'hybrid-version') {
                            contentLeftDesc.find('p:not(.hybrid-version-text)').addClass('displayNone');
                            contentLeftDesc.find('.hybrid-version-text').addClass('visable');
                        } else {
                            contentLeftDesc.find('p:not(.hybrid-version-text)').removeClass('displayNone');
                            contentLeftDesc.find('.hybrid-version-text').removeClass('visable');
                        }
                    });
                });
            });
        },
        onLeave: function(){
            $('#fp-nav').removeClass('hidden');
            var contentLeftDesc = $('.content__description');
            contentLeftDesc.find('p:not(.hybrid-version-text)').removeClass('displayNone');
            contentLeftDesc.find('.hybrid-version-text').removeClass('visable');
        }

    });


    $('.scroll').perfectScrollbar();
    $('.scroll-left').perfectScrollbar();

    $('.close').click(function() {
        var contentLeftDesc = $('.content__description');
        $('.outside__content').removeClass('show');
        $('#fp-nav').removeClass('hidden');
        contentLeftDesc.find('p:not(.hybrid-version-text)').removeClass('displayNone');
        contentLeftDesc.find('.hybrid-version-text').removeClass('visable');
    });


    // var navList = $('.nav__list');
    // var navHeight = navList.height()
    // navList.css('top', -navHeight)




});