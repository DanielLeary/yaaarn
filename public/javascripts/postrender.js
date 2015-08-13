$( document ).ready(function() {
    $('.thePopover').hide();
});



$(".sentence").click(function(){
	if ($('.thePopover').attr('display')!='hide'){
		$('.thePopover').hide(100);
		$('.sentence').removeClass('active-sentence');
		$('.popover-textarea').val('');
	}

	$('.thePopover').show(100);
	$('#theContent').css({ "padding-bottom" : "220px"});
	$(this).addClass('active-sentence');


	var sentenceId = $(this).attr('id');
	var storyId = storyData.id;
	console.log('Sentence ID: '+sentenceId);
	console.log('Story ID: '+storyId);

	//Comment submission
	$('.popover-submit').click(function(){
		var commentText = $('.popover-textarea').val();
		console.log('Comment Text: '+commentText);
	});

	// Close it with button
	$('.popover-close').click(function(){
		$('#theContent').css({ "padding-bottom" : "20px"});
		$('.thePopover').hide(100);
		$('.sentence').removeClass('active-sentence');
		$('.popover-textarea').val('');
	});
});

