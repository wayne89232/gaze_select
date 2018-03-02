    $(document).ready(function() {
        //your code here

        var trial_count = 10
        var circle_count = 0
        var timer = false
        var timer_m = false
        var stop = false
        var stop_time = 0
        var inTime = 0
        var inTime_m = 0
        var taskStart = 0
        var site_list = [
            [$(window).height() / 5, $(window).width() / 5],
            [$(window).height() / 5, $(window).width() / 5 * 3.5],
            [$(window).height() / 5 * 3.5, $(window).width() / 5],
            [$(window).height() / 5 * 3.5, $(window).width() / 5 * 3.5]
        ]
        var marker_list = [
            [$(window).height() / 12, $(window).width() / 12],
            [$(window).height() / 12, $(window).width() / 12 * 11],
            [$(window).height() / 12 * 11, $(window).width() / 12],
            [$(window).height() / 12 * 11, $(window).width() / 12 * 11]
        ]

        center1($("#btn1"));
        $("#btn1").click(function() {


            $("#btn1").hide();
            gen_circle(circle_count)
            taskStart = new Date().getTime()
        });
        $("body").keypress(function(event) {
            if (event.keyCode == 115) {
                $("#btn1").hide();
                gen_circle(circle_count)
                taskStart = new Date().getTime()
            }
        });

        $("body").mousemove(function(event) {
            if ($('#ressss').length) {
                if (isNear($('#ressss'), 10, event)) {
                    if(!timer && !$('#marker').length){
                        timer = true
                        inTime = new Date().getTime()
                    }
                    if((((new Date().getTime())-inTime)/1000 > 1) &&timer) {
                        // fixate in target
                        $('#ressss').foggy(true)
                        gen_marker(circle_count)
                        timer = false
                    }
                    $('#ressss').html('Fixate '+(((new Date().getTime())-inTime)/1000));

                } else {
                    timer = false
                    $('#ressss').empty()

                };
            }
            if($('#marker').length){
                // hide_cursor(true)
                if (isNear($('#marker'), 100, event)) {
                    if(!timer_m){
                        timer_m = true
                        inTime_m = new Date().getTime()
                    }
                    if((((new Date().getTime())-inTime_m)/1000 > 1) &&timer_m) {
                        // fixate in target
                        stop = false
                        circle_count++
                        trigger_gaze(2)
                        if(circle_count < trial_count){
                            gen_circle(circle_count)
                        }
                        else{
                            $("#marker").remove()
                            $("#ressss").remove()
                            var end = new Date().getTime() - taskStart;
                            console.log("Elapse time: "+(end/1000))
                        }
                        hide_cursor(false)
                    }

                } else {
                    timer_m = false

                };

                //new way to count
                // 1. send notification on enter phase
                // set a large enough threshold // maybe 500
                // 2. end on count
            }
            //fail to select
            if(stop && $('#marker').length){
                if((((new Date().getTime())-stop_time)/1000 > 3) &&stop) {
                    stop = false
                    trigger_gaze(3)
                    $("#marker").remove()
                    $("#ressss").foggy(false)
                    hide_cursor(false)
                }
            }
        });

        function isNear($element, distance, event) {

            var left = $element.offset().left - distance,
                top = $element.offset().top - distance,
                right = left + $element.width() + (2 * distance),
                bottom = top + $element.height() + (2 * distance),
                x = event.pageX,
                y = event.pageY;

            return (x > left && x < right && y > top && y < bottom);

        };

        function trigger_gaze(on){
            if(on==1){
                $.post({
                    url: "http://localhost:3000/start_gaze",
                    data: {msg: "start", },
                    success: function (data) {
                        console.log("start");
                    },
                    dataType: "json"
                });
            }
            else if (on==2) {
                $.post({
                    url: "http://localhost:3000/stop_gaze",
                    data: {msg: "stop", },
                    success: function (data) {
                        console.log("stop");
                    },
                    dataType: "json"
                });
            }
            else if (on==3) {
                $.post({
                    url: "http://localhost:3000/restart_gaze",
                    data: {msg: "restart", },
                    success: function (data) {
                        console.log("restart");
                    },
                    dataType: "json"
                });
            }
        }
        function hide_cursor(on){
            if(on){
                document.body.style.cursor = 'none';
            }
            else{
                document.body.style.cursor = '';
            }
        }
        function center1(ele) {
            ele.css("position", "absolute");
            ele.css("top", Math.max(0, (($(window).height() - $(ele).outerHeight()) / 2) +
                $(window).scrollTop()) + "px");
            ele.css("left", Math.max(0, (($(window).width() - $(ele).outerWidth()) / 2) +
                $(window).scrollLeft()) + "px");
            return ele;
        }

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }


        function gen_circle(num) {
            if ($('#ressss').length) {
                $("#ressss").remove();
            }
            if ($('#marker').length) {
                $("#marker").remove();
            }
            var temp = site_list[num];
            $('<div/>', {
                id: "ressss",
                "css": {
                    "top": getRandomInt($(window).height() / 5, $(window).height() / 5*3.5) + "px", //temp[0]
                    "left": getRandomInt($(window).width() / 5, $(window).width() / 5*3.5) + "px" //temp[1]
                },
            }).appendTo('body');

        }
        function gen_marker(num) {
            num = num%4
            $('#ressss').foggy(true)
            stop = true
            stop_time = new Date().getTime()

            if ($('#marker').length) {
                $("#marker").remove();
            }
            var temp = marker_list[num];

            $('<div/>', {
                id: "marker",
                "css": {
                    "background-image": "url(" + "/images/marker.png" + ")",
                    "width": "150px",
                    "height":"150px",
                    "background-repeat": "no-repeat",
                    "top": (temp[0]-70) + "px",
                    "left": (temp[1]-70) + "px",
                    "position": "absolute"
                },
            }).appendTo('body');

            //send zmq signal
            trigger_gaze(1)

        }
    });
