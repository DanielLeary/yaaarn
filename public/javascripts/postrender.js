$( document ).ready(function() {
	$('.tooManyWarning').hide();
    $('.thePopover').hide();
   
    //Creates global var (as misses 'var' keyword) 
	//of sentences current user commented on
	sentencesSelected = [];

	// Log comment sentence Ids user already commented on
	sentenceIdsCommented = [];
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
	$('.tooManyWarning').hide();
	$('button.popover-submit').prop('disabled', false);

	$('.thePopover').show(100);
	$('#theContent').css({ "padding-bottom" : "220px"});


	// If clicked sentence in selected list - remove from list
	var sentenceId = $(this).attr('id');
	
	if (alreadySelected(sentenceId)){
		removeSelected(sentenceId);
		$(this).removeClass('active-sentence');
	}
	else {
		$(this).addClass('active-sentence');
		sentencesSelected.push(sentenceId);
	}

	var storyId = storyData.id;
	console.log('Selected sentences: '+sentencesSelected);
	console.log('Story ID: '+storyId);
	
});

//Comment submission
$('.popover-submit').click(function(){
	var dataToSend = {};
	dataToSend.commentText = $('.popover-textarea').val();
	console.log('Comment Text: '+dataToSend.commentText);
	dataToSend.theSentences = JSON.stringify(sentencesSelected);
	dataToSend.storyId = storyData.id;

	if (sentencesSelected.length>5) {
		$('.tooManyWarning').show();
	} 
	else {
		$('.tooManyWarning').hide();
		
		//Prevent double clicking submit - duplicate in DB
		$('button.popover-submit').prop('disabled', true);
		
		$.post("/api/submit-comment", 
    	dataToSend,
    	function(response, status){	    	
	    	//log response from server
	    	console.log(response);

	    	//redirect
	    	$('.popover-close').trigger('click');
	    });
	}
});

// Close it with button
$('.popover-close').click(function(){
	$('#theContent').css({ "padding-bottom" : "20px"});
	$('.tooManyWarning').hide();
	$('.thePopover').hide(100);
	$('.sentence').removeClass('active-sentence');
	$('.popover-textarea').val('');
	sentencesSelected = [];
});

function clientLogComment(sentenceID) {
	sentenceIdsCommented.push(sentenceID);
}

/*
function alreadyCommented(sentenceID) {
	for(var i=0; i<sentenceIdsCommented.length; ++i){
		if (sentenceIdsCommented[i]==sentenceID) {
			return true;
		}
	}
	return false;
}
*/

function alreadySelected(sentenceID) {
	for(var i=0; i<sentencesSelected.length; ++i){
		if (sentencesSelected[i]==sentenceID) {
			return true;
		}
	}
	return false;
}

function removeSelected(sentenceID) {
	for(var i=0; i<sentencesSelected.length; ++i){
		if (sentencesSelected[i]==sentenceID) {
       		sentencesSelected.splice(i, 1);
		}
	}
}

/* OLD ONE - single sentence highlight
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
*/
