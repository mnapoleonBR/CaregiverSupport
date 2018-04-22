var infoTether; 
var onEvent;
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
			element.description = event.description
			element.location = event.location
		}, 

		// eventMouseover: function(date, jsEvent, view) {
		// mouseOverFill(date)
		// },

		eventMouseover: function(event, element) {
			onEvent = true
			console.log(onEvent)
		},

		eventMouseout: function(event, element) {
			onEvent = false;
			console.log(onEvent)
		},
	
		eventClick: function(event) {
		    // if (event.url) {
		    //   window.open(event.url);
		    //   return false;
		    // }
	    	mouseOverFill(event, this)
	    	return false
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

	$('#event-info').hide();
	$('#closeInfoButton').click(function() {
		$('#event-info').hide()
	});

	$('#calendar').click(function(e) {
		console.log($('#calendar').fullCalendar('getView').name)
		if(!onEvent) {
			clearTether()
		}
	});
});

function cleanModal() {
	$('#modalBody').empty();
	$('#submit').hide();
}

function clearTether() {
	$('#tetherElement').removeAttr("id")
	$('#event-info').hide()
	if(!$.isEmptyObject(infoTether)) {
		infoTether.destroy()
	}
}

function mouseOverFill(event, element) {
	clearTether()
	var start = event.start.format('MMMM Do YYYY, h:mm a')
	var end = event.end.format('MMMM Do YYYY, h:mm a')

	$('#title').empty()
	$('#location').empty()
	$('#description').empty()
	$('#dateTime').empty()

	$('<a target="_blank" href=' + event.url + '>' + event.title + '</a>').appendTo('#title')

	if(typeof event.location !== "undefined") {
		$('<h4> ' + event.location + ' </h4>').appendTo('#location');
	} 

	if(typeof event.description !== "undefined") {
		$('<p> ' + event.description + ' </p>').appendTo('#description');
	} 

	if(typeof event.start !== "undefined" && event.end !== "undefined") {
		$('<h4> ' + start + ' - ' + end + ' </h4>').appendTo('#dateTime');
	} 

	$(element).attr('id', 'tetherElement')
	$('#event-info').show()
	$('#linkButton').attr('href', event.url)

	if ($('#calendar').fullCalendar('getView').name !== "listMonth") {
		console.log('FIRST')
		infoTether = new Tether({
			element: '#event-info',
			target: '#tetherElement',
			attachment: 'top right',
			targetAttachment: 'top left',
			offset: '30px 5px',
			constraints: [
				{
				  to: 'scrollParent',
				  attachment: 'together'
				}
			]
		});
	} 
	else {
		console.log('SECOND')
		infoTether = new Tether({
			element: '#event-info',
			target: '#tetherElement',
			attachment: 'bottom left',
			targetAttachment: 'top left',
			offset: '0px -10px',
			constraints: [
				{
				  to: 'scrollParent',
				  attachment: 'together'
				}
			]
		});
	}
	
} 
