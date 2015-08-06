$("#submit-final").click(function(){
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

