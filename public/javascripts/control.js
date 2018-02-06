    $(document).ready(function() {
        //your code here


        var circle_count = 0
        var timer = false
        var timer_m = false
        var stop = false
        var stop_time = 0
        var inTime = 0
        var inTime_m = 0
        var taskStart = 0
        var site_list = [
            [$(window).height() / 3, $(window).width() / 3],
            [$(window).height() / 3, $(window).width() / 3 * 2],
            [$(window).height() / 3 * 2, $(window).width() / 3],
            [$(window).height() / 3 * 2, $(window).width() / 3 * 2]
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
        $("body").mousemove(function(event) {
            if ($('#ressss').length) {
                if (isNear($('#ressss'), 10, event)) {
                    if(!timer && !$('#marker').length){
                        timer = true
                        inTime = new Date().getTime()
                    }
                    if((((new Date().getTime())-inTime)/1000 > 2) &&timer) {
                        // fixate in target
                        $('#ressss').foggy(true)
                        timer = false
                        gen_marker(circle_count)
                    }
                    $('#ressss').html('Fixate '+(((new Date().getTime())-inTime)/1000));

                } else {
                    timer = false
                    $('#ressss').empty()

                };
            }
            if($('#marker').length){
                if (isNear($('#marker'), 10, event)) {
                    if(!timer_m){
                        timer_m = true
                        inTime_m = new Date().getTime()
                    }
                    if((((new Date().getTime())-inTime_m)/1000 > 2) &&timer_m) {
                        // fixate in target
                        stop = false
                        circle_count++
                        trigger_gaze(false)
                        if(circle_count < site_list.length){
                            gen_circle(circle_count)
                        }
                        else{
                            $("#marker").remove()
                            $("#ressss").remove()
                            var end = new Date().getTime() - taskStart;
                            console.log("Elapse time: "+(end/1000))
                        }
                    }

                } else {
                    timer_m = false

                };
            }
            //fail to select
            if(stop){
                if((((new Date().getTime())-stop_time)/1000 > 5) &&stop) {
                    stop = false
                    trigger_gaze(false)
                    $("#marker").remove()
                    $("#ressss").foggy(false)
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
            if(on){
                $.post({
                    url: "http://localhost:3000/start_gaze",
                    data: {msg: "start", },
                    success: function (data) {
                        console.log("Success");
                    },
                    dataType: "json"
                });
            }
            else{
                $.post({
                    url: "http://localhost:3000/stop_gaze",
                    data: {msg: "stop", },
                    success: function (data) {
                        console.log("Success");
                    },
                    dataType: "json"
                });
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
                    "top": temp[0] + "px",
                    "left": temp[1] + "px"
                },
            }).appendTo('body');

        }
        function gen_marker(num) {
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
            trigger_gaze(true)

        }
    });
