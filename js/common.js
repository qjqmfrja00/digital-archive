'use strict';

$(function() {
    //a 링크 동작 막기
    $(document).on('click', 'a[href="#"]', function(e){
        e.preventDefault();
    });
    
    //메인 메뉴 클릭
    setGnb();
    function setGnb() {
        //PC
        $('#gnb > ul > li > a').on('mouseenter focus', function() {
            if ($(window).width() < 1025) return false;
            $('#gnb').stop(true).animate({'height': '180px'}, 300);
            $('#gnb > ul > li > ul').stop(true).slideDown(300);
        });
        $('#header').on('mouseleave', function() {
            if ($(window).width() < 1025) return false;
            $('#gnb').stop(true).animate({'height': '0'}, 300);
            $('#gnb > ul > li > ul').stop(true).slideUp(300);
        });
        $('a').not('#header, #gnb').on('focusin', function() {
            $('#header').trigger('mouseleave');
        });
        //모바일
        $('#gnb > ul > li > ul > li > a').each(function() {
            $(this).append('<i class="fas fa-plus mobile"></i>');
        });
        $('#header a.menu').on('click', function() {
            $('#gnb').css({'height': '100%'});
            $('#header a.menu').toggleClass('open');
            if ($('#header a.menu').hasClass('open')) {
                $('#gnb > ul > li.on > ul').css({'display': 'block'});
                $('body').css({'height': '100%', 'overflow': 'hidden'});
                $(this).before('<div id="layer-mask" tabindex="0"></div>');
                $(this).next('nav').append('<a href="#" class="return"></a>');
            } else {
                $('body').css({'height': 'auto', 'overflow': 'auto'});
                $('#layer-mask').remove();
                $('#header').find('a.return').remove();
            }
            $('#layer-mask').on('click', function() {
                 $('#header a.menu').trigger('click');
            }).on('focus', function() {
                 $('#gnb > ul > li.on > ul > li:last-child > a').trigger('focus');
            });
            $('#header').find('a.return').on('focus', function() {
                $('#header a.menu').trigger('focus');
            });
        });
        $('#gnb > ul > li > a').on('click', function(e) {
            if ($(window).width() < 1181) {
                e.preventDefault();
                $('#gnb > ul > li').removeClass('on');
                $('#gnb > ul > li > ul').css({'display': 'none'});
                $(this).parent().addClass('on');
                $(this).next('ul').css({'display': 'block'});
            }
        });
    }
    
    //메인 슬라이드
    setSlide('#main-visual', true, 4000);
    function setSlide(selector, status, speed) {
        var numSlide = $(selector).find('ul.slide li').length;
        var slideNow = 0;
        var slidePrev = 0;
        var slideNext = 0;
        var timerId = '';
        var timerSpeed = speed;
        var isTimerOn = status;
        
        showSlideFade(1);
        
        $(selector).find('a.prev').on('click', function() {
            showSlideFade(slidePrev);
        });
        $(selector).find('a.next').on('click', function() {
            showSlideFade(slideNext);
        });
        
        function showSlideFade(n) {
            clearTimeout(timerId);
            if (slideNow === 0) {
                $(selector).find('ul.slide li').css({'display' : 'none'});
                $(selector).find('ul.slide li:eq(' + (n - 1) + ')').css({'display' : 'block'}); 
            } else {
                $(selector).find('ul.slide li').stop().animate({'opacity' : 0}, 700, function() {$(this).css({'display' : 'none'});});
                $(selector).find('ul.slide li:eq(' + (n - 1) + ')').css({'display' : 'block', 'opacity' : 0}).stop().animate({'opacity' : 1}, 700);
                $(selector).find('span.slide-now').text(slideNow);
            }
            slideNow = n;
            slideNext = n + 1 > numSlide ? 1 : n + 1;
            slidePrev = n - 1 < 1 ? numSlide : n - 1;
            if (isTimerOn === true) {
                timerId = setTimeout(function() {showSlideFade(slideNext);}, timerSpeed);
            }
        }
    }
    
    //배너 슬라이드
    setBannerSlide('#main-history');
    function setBannerSlide(selector) {
        var offsetLeft = 0;
        var boxWidth = $(selector).find('div.box').innerWidth();
        var barWidth = 0;
        var minOffsetLeft = 0;
        var moveDistance = $(selector).find('ul.slide li').outerWidth();
        var timerId = '';

        barWidth = $(selector).find('div.box ul.slide').innerWidth();
        minOffsetLeft = -(barWidth - boxWidth);
        $(window).on('resize', function() {
            clearTimeout(timerId);
            timerId = setTimeout(function() {
                offsetLeft = 0;
                moveDistance = $(selector).find('ul.slide li').outerWidth();
                $(selector).find('div.box ul.slide').css({'left': 0});
            }, 300);
        });

        $(selector).find('div.control a.prev').on('click', function() {
            $(this).find('i').stop(true).animate({'left': '-3px'}, 50).animate({'left': 0}, 100);
            moveBanner('prev', 'manual');
        });
        $(selector).find('div.control a.next').on('click', function() {
            $(this).find('i').stop(true).animate({'right': '-3px'}, 50).animate({'right': 0}, 100);
            moveBanner('next', 'manual');
        });

        function moveBanner(direction, type) {
            if (direction === 'prev') {
                if (offsetLeft === 0) {
                    $(selector).find('ul.slide').stop(true).animate({'left': '10px'}, 50).animate({'left': 0}, 100);
                } else {
                    offsetLeft += moveDistance;
                    if (offsetLeft > 0) offsetLeft = 0;
                    $(selector).find('ul.slide').stop().animate({'left': offsetLeft + 'px'}, 500);
                }
            } else if (direction === 'next') {
                if (offsetLeft === minOffsetLeft) {
                    if (type === 'auto') {
                        offsetLeft = 0;
                        $('div.box ul.slide').stop().animate({'left': offsetLeft + 'px'}, 500);
                    } else {
                        $('div.box ul.slide').stop(true).animate({'left': (minOffsetLeft - 10) + 'px'}, 50).animate({'left': minOffsetLeft + 'px'}, 100);
                    }
                } else {
                    offsetLeft -= moveDistance;
                    if (offsetLeft < minOffsetLeft) offsetLeft = minOffsetLeft;
                    $(selector).find('ul.slide').stop().animate({'left': offsetLeft + 'px'}, 500);
                }
            }
        }
    } 
    
    //label 클릭
    setLabel('#main-search form')
    setLabel('#local-nav form');
    function setLabel(selector) {
        $(selector).find('input[type=text]').on('focus', function() {
            $(selector).find('label').hide()
        }).on('blur', function() {
            if ($(selector).find('input[type=text]').val() === '') {
                $(selector).find('label').show();
            }
        });
    }
    
    //메인 페이지 카운팅 이펙트
    setCounting('#main-search ul.category li em', 20, 1000);
    function setCounting(selector, numStep, duration) {
        $(selector).each(function() {
            var $this = $(this);
            var target = Number($this.text()); 
            var numNow = 0;
            var numNowComma = '';
            var timerId = 0;
            var step = Math.round(target / numStep); //루프가 돌때마다 올라갈 숫자
            var timerSpeed = duration / numStep; //타이머 진행 시간

            $this.text(0);
            addNumber();
            function addNumber() {
                numNow += step;
                if (numNow >= target) {
                    numNow = target;
                    numNowComma = numNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    $this.text(numNowComma);
                } else {
                    numNowComma = numNow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    $this.text(numNowComma);
                    setTimeout(function() {addNumber();}, timerSpeed);
                }
            }
        });
    }
    
    //서브페이지 lnb 메뉴 클릭
    setLocation('#sub-contents ul.location > li > a', true);
    setLocation('#sub-contents ul.sub-util li.sharing a', false);
    function setLocation(selector, status) {
        var isAnimationOn = status;
        
        $(selector).on('click', function() {
            $(selector).not($(this)).next('ul').css({'display': 'none'});
            $(selector).not($(this)).removeClass('on');
            $(this).toggleClass('on');
            if ($(this).hasClass('on')) {
                if (isAnimationOn === true) {
                    $(this).next('ul').slideDown(400);
                } else {
                    $(this).next('ul').css({'display': 'block'});
                }
            } else {
                if (isAnimationOn === false) {
                    $(this).next('ul').css({'display': 'none'});
                } else {
                    $(this).next('ul').slideUp(400);
                }
            }
        });
    }
    
    //구글 차트
    setChart();
    function setChart() {
        if ($('#charts').length === 0) return false;
        google.charts.load("current", {packages:['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
            ["Element", "자료수", { role: "style" } ],
            ["고고·미술", 1841, "#b87333"],
            ["단행본", 965, "gold"],
            ["문헌", 1823, "#3872e0"],
            ["보존과학", 53, "color: #28447b"],
            ["지리환경", 60, "color: #ab40cb"],
            ["학위논문", 747, "color: #6333bf"],
            ["기타", 148, "color: #e5e4e2"]
          ]);

          var view = new google.visualization.DataView(data);
          view.setColumns([0, 1,
                           { calc: "stringify",
                             sourceColumn: 1,
                             type: "string",
                             role: "annotation" },
                           2]);

          var options = {
            title: "학술자료 제공 현황",

            legend: { position: "none" },
          };
          var chart = new google.visualization.ColumnChart(document.getElementById("charts"));
          chart.draw(view, options);
        }
        $(window).on('resize', function() {
            var timerId = '';
            clearTimeout(timerId);
            timerId = setTimeout(function() {
                google.charts.setOnLoadCallback(drawChart);
            }, 400);
        });
    } 
});
