


$(document).ready(function() {

    // page is now ready, initialize the calendar...
    console.log("here?")
    $('#calendar').fullCalendar({
        // put your options and callbacks here
        defaultDate: '2014-09-12',
        editable: true,
        eventLimit: true
    })

});