$( document ).ready(function() {
	$('.alreadyCommentedWarning').hide();
    $('.thePopover').hide();
   
    //Creates global var (as misses 'var' keyword) 
	//of sentences current user commented on
	sentenceIdsCommented = [];

	// Log comment sentence Ids user already commented on
	for(var i=0; i<storyComments.length;++i){
		var comment = storyComments[i];
		if(comment.authorName==theUsername){	
			sentenceIdsCommented.push(comment.sentenceId);
			//console.log("Comment by "+theUsername+": "+comment.text);
			//console.log("Comment date: "+moment(comment.date).fromNow());
		}
	}
});



$(".sentence").click(function(){
	if ($('.thePopover').attr('display')!='hide'){
		$('.thePopover').hide(100);
		$('.sentence').removeClass('active-sentence');
		$('.popover-textarea').val('');
	}

	$('.alreadyCommentedWarning').hide();
	$('button.popover-submit').prop('disabled', false);

	$('.thePopover').show(100);
	$('#theContent').css({ "padding-bottom" : "220px"});
	$(this).addClass('active-sentence');


	var sentenceId = $(this).attr('id');
	var storyId = storyData.id;
	console.log('Sentence ID: '+sentenceId);
	console.log('Story ID: '+storyId);

	//Comment submission
	$('.popover-submit').click(function(){
		var dataToSend = {};
		dataToSend.commentText = $('.popover-textarea').val();
		console.log('Comment Text: '+dataToSend.commentText);
		dataToSend.sentenceId = sentenceId;
		dataToSend.storyId = storyId;

		if (alreadyCommented(sentenceId)) {
			$('.alreadyCommentedWarning').show();
		} 
		else {
			$('.alreadyCommentedWarning').hide();
			
			//Prevent double clicking submit - duplicate in DB
			$('button.popover-submit').prop('disabled', true);
			
			$.post("/api/submit-comment", 
	    	dataToSend,
	    	function(response, status){	    	
		    	//log response from server
		    	console.log(response);

		    	// To prevent multiple comments
		    	clientLogComment(sentenceId);

		    	//redirect
		    	$('.popover-close').trigger('click');
		    });
		}
	});
	
});

// Close it with button
$('.popover-close').click(function(){
	$('#theContent').css({ "padding-bottom" : "20px"});
	$('.alreadyCommentedWarning').hide();
	$('.thePopover').hide(100);
	$('.sentence').removeClass('active-sentence');
	$('.popover-textarea').val('');
});

function clientLogComment(sentenceID) {
	sentenceIdsCommented.push(sentenceID);
}


function alreadyCommented(sentenceID) {
	for(var i=0; i<sentenceIdsCommented.length; ++i){
		if (sentenceIdsCommented[i]==sentenceID) {
			return true;
		}
	}
	return false;
}

