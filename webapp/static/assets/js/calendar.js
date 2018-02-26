$(document).ready(function() {
    // page is now ready, initialize the calendar...
    console.log("here?")
    $('#calendar').fullCalendar({
        // put your options and callbacks here
   		googleCalendarApiKey: 'AIzaSyDgGyzwt9WQjT9bDBZu4PXxnJuHSQLtHdY',
   		events: {
   			googleCalendarId: 'jh4k25spig0mj610ipq0de83h0@group.calendar.google.com'
   		}
    })

});