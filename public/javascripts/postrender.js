$( document ).ready(function() {
	$('.tooManyWarning').hide();
    $('.thePopover').hide();
    $('.info-box-wrap').hide();

    freezeInfo = false;
   
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

	for (var i=0; i<commentSentences.length;++i){
		var sentenceId = commentSentences[i].sentenceId;
		var sentenceNode = $('#'+sentenceId);

		if(!sentenceNode.hasClass('has-content'))
			sentenceNode.addClass('has-content');
	}
	for (var i=0; i<badgeSentences.length;++i){
		var sentenceId = badgeSentences[i].sentenceId;
		var sentenceNode = $('#'+sentenceId);

		if(!sentenceNode.hasClass('has-content'))
			sentenceNode.addClass('has-content');
	}

});

$(".sentence").click(function(){
	freezeInfo = true;

	$('.tooManyWarning').hide();
	$('button.popover-submit').prop('disabled', false);

	// Remove highlighted comments upon click of one
	if ($(this).hasClass('highlight-sentence')){
		$('.highlight-sentence').removeClass('highlight-sentence');
		freezeInfo = false;
		return;
	}

	$('.thePopover').show(100);
	$('#commentSection').css({ "padding-bottom" : "220px"});


	// If clicked sentence in selected list - remove from list
	var sentenceId = $(this).attr('id');
	
	if (alreadySelected(sentenceId)){
		removeSelected(sentenceId);
		$(this).removeClass('active-sentence');
		freezeInfo = false;
		$('.info-box-wrap').hide();
		$('.info-box-comment-wrap').remove();
		if(sentencesSelected<1)
		 	$('.popover-close').trigger('click');
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
	freezeInfo = false;
	$('.info-box-wrap').hide();
	$('.info-box-comment-wrap').remove();
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

			//Remove highlight if there is one
			$('.comment-wrap').removeClass("hi-in-comment-section");

			$('html, body').animate({
        		scrollTop: $( $.attr(this, 'href') ).offset().top
    		}, 200);
			$(this).attr('href', '#'+commentId);
    		return false;

			//$(this).trigger('click');
		}
	}
});

$(".sentence").hover(function(){
	if (freezeInfo)
		return

	var sentenceId = $(this).attr('id');

	var happy = 0;
	var funny = 0;
	var sad = 0;
	var angry = 0;

	for (var i=0; i<badgeSentences.length; ++i){
		var currentSentence = badgeSentences[i];
		if (currentSentence.sentenceId == sentenceId){
			var badgeId = currentSentence.BadgeId;
			var theBadge = getBadge(badgeId);
			if (theBadge.badgeType == "happy")
				++happy;
			if (theBadge.badgeType == "funny")
				++funny;
			if (theBadge.badgeType == "sad")
				++sad;
			if (theBadge.badgeType == "angry")
				++angry;
		}
	}
	/*
	console.log("Happy count: " + happy);
	console.log("Funny count: " + funny);
	console.log("Sad count: " + sad);
	console.log("Angry count: " + angry);
	*/
	var leftOffset = $('.main-right').offset().left + 30;
	var topOffset = $(this).offset().top;
	$('.info-box-wrap').css({'top': topOffset, 'left': leftOffset});

	if (happy<1)
		$('.info-happy-square').hide();
	else
		$('.info-happy-square').show();
	
	if (funny<1)
		$('.info-funny-square').hide();
	else
		$('.info-funny-square').show();
	
	if (sad<1)
		$('.info-sad-square').hide();
	else
		$('.info-sad-square').show();

	if (angry<1)
		$('.info-angry-square').hide();
	else
		$('.info-angry-square').show();

    $('.info-box-wrap').show();

	$('.info-happy').text(happy);
	$('.info-funny').text(funny);
	$('.info-sad').text(sad);
	$('.info-angry').text(angry);


	// COMMENTS IMPLEMENTATION
	var comment_count = 0;
	var commentList = [];

	for (var i=0; i<commentSentences.length; ++i){
		var currentSentence = commentSentences[i];
		if (currentSentence.sentenceId == sentenceId){
			var commentId = currentSentence.CommentId;
			var theComment = getComment(commentId);
			commentList.push(theComment);

			++comment_count;
		}
	}

	if (comment_count<1)
		$('.info-box-comment-count').hide();
	else
		$('.info-box-comment-count').show();

	if (comment_count==1)
		$('.info-box-comment-count').text(comment_count+' comment');
	else
		//Plural commentS
		$('.info-box-comment-count').text(comment_count+' comments');


	var nodeString="<div class=\"info-box-comment-wrap\">" +
	"<a href=\"\" class=\"info-box-author\"></a>" +
	"<p class=\"info-box-comment-text\"></p>" +
	"<a href=\"\" class=\"info-box-read-link\">Continue reading</a>" +
	"</div>"

	for (var i=0; i<commentList.length; ++i){
		var currentComment = commentList[i];
		//var node = $('.info-box-comment-wrap').clone();
		var node = $($.parseHTML(nodeString));

		//Limit text size
		var theText = currentComment.text;
		if (currentComment.text.length>140){
			theText = theText.substring(0,140)+'...';
		}
		node.children('.info-box-comment-text').text(theText);
		node.children('a.info-box-read-link').attr('href', '#comment-'+currentComment.id);
		node.children('a.info-box-author').attr('href', '/profile/'+currentComment.authorName);
		node.children('a.info-box-author').text(currentComment.authorName+" said");
		node.appendTo('.info-box-wrap');

		// Close popover when people follow read more link
		$("a.info-box-read-link").click(function(){
			$('.comment-wrap').removeClass("hi-in-comment-section");
			var commentId = $(this).attr('href');
			$(commentId).addClass("hi-in-comment-section");
			$('.popover-close').trigger('click');
			// This does default link action
			return true;
		});
	}



}, function(){
	if (freezeInfo)
		return
	$('.info-box-wrap').hide();
	$('.info-box-comment-wrap').remove();
	console.log('Test mouse out');
});




function getBadge(badgeId) {
	for (var i=0; i<storyBadges.length; ++i){
		if (storyBadges[i].id == badgeId)
			return storyBadges[i];
	}
}

function getComment(commentId) {
	for (var i=0; i<storyComments.length; ++i){
		if (storyComments[i].id == commentId)
			return storyComments[i];
	}
}


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
