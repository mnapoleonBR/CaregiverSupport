$(document).ready(function() {

	$('#eventForm').submit(function(e) {
		e.preventDefault();
		$.ajax({
			url:'/submitMessage',
			type:'post',
			data:$('#eventForm').serialize(),
			success:function(){
				cleanModal();
				$('#modalBody').append("<p> Your message was sent! A BakerRipley caregiving specialist will follow up with you shortly. </p>");
			},
			error:function(){
				cleanModal();
				$('#modalBody').append("<p> An error occurred, please refresh the page and try again. </p>");
			}
		});
	});

});


function cleanModal() {
	$('#modalBody').empty();
	$('#submit').hide();
}