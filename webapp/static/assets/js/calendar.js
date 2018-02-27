$(document).ready(function() {
    // page is now ready, initialize the calendar...
    $('#calendar').fullCalendar({
        // put your options and callbacks here
   		googleCalendarApiKey: 'AIzaSyDgGyzwt9WQjT9bDBZu4PXxnJuHSQLtHdY',
   		events: {
   			googleCalendarId: 'jh4k25spig0mj610ipq0de83h0@group.calendar.google.com'
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

});


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