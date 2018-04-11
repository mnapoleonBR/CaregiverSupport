$(document).ready(function() {
	// page is now ready, initialize the calendar...
	var API_KEY = 'AIzaSyDgGyzwt9WQjT9bDBZu4PXxnJuHSQLtHdY'
	var CALENDAR_ID = 'jh4k25spig0mj610ipq0de83h0@group.calendar.google.com'
	$('#calendar').fullCalendar({
	// put your options and callbacks here
		googleCalendarApiKey: API_KEY,
		events: {
			googleCalendarId: CALENDAR_ID
		},   		
		header: {
			left: 'title, today',
			right: 'month,agendaWeek,listMonth, prev,next'
		}, 
		eventColor: '#ca6015', 

		// Adds event description from GCal to date object for use in eventMouseover
		eventRender: function(event, element) {
			element.description = event.description,
			element.location = event.location
		}, 

		eventMouseover: function(date, jsEvent, view) {
		mouseOverFill(date)
	}
})

	$('#eventForm').submit(function(e) {
		e.preventDefault();
		$.ajax({
			url:'/submitEvent',
			type:'post',
			data:$('#eventForm').serialize(),
			success:function(){
				cleanModal();
				$('#modalBody').append("<p> Event submitted successfully! A BakerRipley caregiving specialist will review your suggestion shortly. </p>");
			},
			error:function(){
				cleanModal();
				$('#modalBody').append("<p> An error occurred, please refresh the page and try again. </p>");
			}
		});
	});

	$('#datetimepicker1').datetimepicker({
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down"
            }
    	});

	$('#datetimepicker2').datetimepicker({
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-arrow-up",
            down: "fa fa-arrow-down"
        }
	});

});

function cleanModal() {
	$('#modalBody').empty();
	$('#submit').hide();
}

function mouseOverFill(event) {
	var start = event.start.format('MMMM Do YYYY, h:mm a')
	var end = event.end.format('MMMM Do YYYY, h:mm a')

	$('#title').empty()
	$('#location').empty()
	$('#description').empty()
	$('#dateTime').empty()

	$('<a href=' + event.url + '>' + event.title + '</a>').appendTo('#title')

	if(typeof event.location !== "undefined") {
		$('<p> ' + event.location + ' </p>').appendTo('#location');
	} 

	if(typeof event.description !== "undefined") {
		$('<p> ' + event.description + ' </p>').appendTo('#description');
	} 

	if(typeof event.start !== "undefined" && event.end !== "undefined") {
		$('<p> ' + start + ' - ' + end + ' </p>').appendTo('#dateTime');
	} 

} 
