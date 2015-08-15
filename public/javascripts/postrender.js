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

	// Remove highlighted comments upon click of one
	if ($(this).hasClass('highlight-sentence')){
		$('.highlight-sentence').removeClass('highlight-sentence');
		return;
	}

	$('.thePopover').show(100);
	$('#commentSection').css({ "padding-bottom" : "220px"});


	// If clicked sentence in selected list - remove from list
	var sentenceId = $(this).attr('id');
	
	if (alreadySelected(sentenceId)){
		removeSelected(sentenceId);
		$(this).removeClass('active-sentence');
	}
	else {
		//Deselect first sentence if we've selected 5 already
		if (sentencesSelected.length>4){
			$('#'+sentencesSelected[0]).removeClass('active-sentence');
			removeSelected(sentencesSelected[0]);
			$(this).addClass('active-sentence');
			sentencesSelected.push(sentenceId);
		}
		else{
			$(this).addClass('active-sentence');
			sentencesSelected.push(sentenceId);
		}
	}

	var storyId = storyData.id;
	console.log('Selected sentences: '+sentencesSelected);
	console.log('Story ID: '+storyId);
	
});

//Comment submission
$('.popover-submit').click(function(){

	if (sentencesSelected.length<1) {
		return
	}
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
	$('#commentSection').css({ "padding-bottom" : "20px"});
	$('.tooManyWarning').hide();
	$('.thePopover').hide(100);
	$('.sentence').removeClass('active-sentence');
	$('.popover-textarea').val('');
	sentencesSelected = [];
});

$('.badge-square').click(function(){
	if (sentencesSelected.length<1 || $(this).hasClass('disabledBadge')) {
		return
	}
	var dataToSend = {};
	if($(this).attr('id') == "funny")
		dataToSend.badgeType = 'funny';
	if($(this).attr('id') == "happy")
		dataToSend.badgeType = 'happy';
	if($(this).attr('id') == "sad")
		dataToSend.badgeType = 'sad';
	if($(this).attr('id') == "angry")
		dataToSend.badgeType = 'angry';

	dataToSend.theSentences = JSON.stringify(sentencesSelected);
	dataToSend.storyId = storyData.id;

	if (sentencesSelected.length>5) {
		$('.tooManyWarning').show();
	} 
	else {
		$('.tooManyWarning').hide();
		
		//Prevent double clicking submit - duplicate in DB
		$(this).addClass('disabledBadge');
		
		$.post("/api/submit-badge", 
    	dataToSend,
    	function(response, status){	    	
	    	//log response from server
	    	console.log(response);

	    	$(this).removeClass('disabledBadge');
	    	//redirect
	    	$('.popover-close').trigger('click');
	    });
	}
});


$("a.comment").click(function(){
	//substr removes the #
	var commentId = $(this).attr('href').substr(1);
	console.log(commentId);
	$('.highlight-sentence').removeClass('highlight-sentence');

	for (var i=0; i<commentSentences.length; ++i){
		if (commentSentences[i].CommentId==commentId){
			var firstSentenceListed = commentSentences[i].sentenceId;
			console.log('First sentence id '+firstSentenceListed);
			hiAssociatedSentences(commentId);

			$(this).attr('href', '#'+firstSentenceListed);

			$('html, body').animate({
        		scrollTop: $( $.attr(this, 'href') ).offset().top
    		}, 200);
			$(this).attr('href', '#'+commentId);
    		return false;

			//$(this).trigger('click');
		}
	}
});



function hiAssociatedSentences(commentId) {
	for (var i=0; i<commentSentences.length; ++i){
		if (commentSentences[i].CommentId==commentId){
			var sentenceId = commentSentences[i].sentenceId;
			$('#'+sentenceId).addClass('highlight-sentence');
		}
	}
}


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
