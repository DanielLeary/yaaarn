$("#submit-final").click(function(){
    formatTags('p-story');
    formatTags('li-story');
    formatTags('blockquote-story');
    formatTags('h1-story');
    formatTags('h2-story');
    formatTags('h3-story');
    formatTags('h4-story');
    formatTags('h5-story');
    formatTags('h6-story');

    //Prepare data
    var dataToSend = {};
    dataToSend.theUrl = storyData.url;
	
	var titleElement = document.getElementById('theTitle');
    dataToSend.theTitle = titleElement.innerText || titleElement.textContent;
    
	var contentElement = document.getElementById('theContent');
    dataToSend.theText = contentElement.innerHTML;

    // Make request
    $.post("/api/submit-draft-link", 
    dataToSend,
    function(slugurl, status){
    	console.log(dataToSend.theTitle);
    	
    	//log response from server
    	console.log(slugurl);

    	//redirect
    	window.location.href = '/' + slugurl;
    });
});



$("#submit-final2").click(function(){
    formatTags('p-story');
    formatTags('li-story');
    formatTags('blockquote-story');
    formatTags('h1-story');
    formatTags('h2-story');
    formatTags('h3-story');
    formatTags('h4-story');
    formatTags('h5-story');
    formatTags('h6-story');

});



function formatTags(tagName) { 

    var TagList = document.getElementsByClassName(tagName);
    // So that we can use innertext JQuery version
    var TagListJQuery = $("."+tagName);
    //console.log('Jquery p-story tag count= ' + pTagListJQuery.length);
    //console.log('Browser p-story tag count= ' + pTagList.length);


    for (var i=0; i<TagList.length; ++i) {
        
        //NOTE: only JQuery innerText supported in firefox
        //var pTagText = pTagListJQuery[i].innerText;
        var TagText = TagListJQuery[i];
        TagText = $(TagText).text();


        var sentenceList = TagText.match( /[^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g );
        //var sentenceList = pTagText.match( /[^.!?]*[.!?]*['"]*/g );

        // Log results from results array
        for (var i2=0; i2 < sentenceList.length; i2++) {
            //console.log(sentenceList[i2]);
            //console.log('chars = '+sentenceList[i2].length);
        }
    
        document.designMode = "on";

        var sel = window.getSelection();
        
        // This sets start position for search
        var theNode = TagList[i];    
        sel.collapse(theNode, 0);
        
        // window.find searches and highlights found text
        for (var x=0; x<sentenceList.length; ++x) {
            var text = sentenceList[x];
            
            // Length>0 check as if firefox does find on empty string opens dialog
            if (text.length>0){    
                var found = window.find(text);
                if (found) {
                    document.execCommand("HiliteColor", false, "blue");
                    sel.collapseToEnd();
                }

                $("*").filter(function(){
                    //console.log('BG color browser format= '+$(this).css('background-color'));
                    return $(this).css('background-color') === "rgb(0, 0, 255)";
                }).each(function(){
                    var randomNum = Math.floor(Math.random() * 1000000000000000) + 1000000000000000;
                    $(this).css('background-color', '');
                    $(this).addClass('sentence');
                    $(this).attr('id',randomNum);
                });
            }
            
            /* OLD METHOD
            $('span:not(.span-story)').addClass('toUpdate'); 

            $(".toUpdate").each(function(){
                var randomNum = Math.floor(Math.random() * 1000000000) + 1000000000;
                $(this).replaceWith("<span class=\"sentence\" id=\"" +randomNum+ "\">" + $(this).html() +  "</span>");
            });
            */
        }
        
        document.designMode = "off";
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        //window.scrollTo(0, 0);
    } 
     
}





