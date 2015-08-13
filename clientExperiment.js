<input type="button" id="button" onmousedown="getSentences()" value="Go">

    <p class="content">Here <b>is some text.Here</b> is some text. With a variety of formatting! and this?'" and this... and that!!!"' and"' that??? and ending without punctuation </p>
<p class="content">Alternative text. This is some?" 09</p>
<p class="content">Here is some text. Heres where it differs</p>

    

function getSentences() {
    //addStopAtEnd();
    
    var str = $('p.content')[0].innerHTML;
    //var str = document.getElementById('content').innerHTML;
    
    //Old regex - not good enough
    //var result = str.match( /[^\.!\?]+[\.!\?]+/g );
    
    //Source: http://stackoverflow.com/questions/5553410/regular-expression-match-a-sentence
    //var result = str.match( /[^.!?\s][^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g );
    
    // Without eliminating start whitespace
    //var result = str.match( /[^.!?]*(?:[.!?](?!['"]?\s|$)[^.!?]*)*[.!?]?['"]?(?=\s|$)/g );
    
    // My version
    var result = str.match( /[^.!?]*[.!?]*['"]*/g );
    
    
    //Experiment
    nextbit();
    
    
    
    // Log results from results array
    for (var i=0; i < result.length; i++) {
        console.log(result[i]);
        console.log('chars = '+result[i].length);
    }   
}

function addStopAtEnd() {
    $('p').each(function() {
        // append a period
        var theHtml = $(this).html();
        $(this).html(theHtml + '.');
    });
}

function nextbit2() {
    document.designMode = "on";
    
    var theNode = document.getElementsByClassName("content")[0];    
    var range = document.createRange();
    //range.setStart(theNode.firstChild,1); 
    //range.setEnd(theNode.firstChild,5);
    
    range.selectNode(theNode);
    console.log('Start offset of range: '+ range.startOffset);
    console.log('End offset of range: '+ range.endOffset);
    
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    //document.execCommand("HiliteColor", false, "yellow");
    //Collapses caret to end of selection
    //sel.collapseToEnd();
    document.designMode = "off";
}

function nextbit() {
        document.designMode = "on";

        var sel = window.getSelection();
        // This sets start position for search
        var theNode = document.getElementsByClassName("content")[2];    
        sel.collapse(theNode, 0);
        
        var theSentences = [
            "Here is some text.",
            "Here is some text.",
            " With a variety of formatting!",
            "Bad match test - wont find this",
            " and this?\'\"",  
            " and this..."
        ];
    
        var theSentences3 = [
            "Here is some text.",
            " Here's where it differs"
        ];
        //var text = theSentences[2];
        var colorNum = 2;
        // window.find searches and highlights found text
        for (var i=0; i<theSentences3.length; ++i) {
            text = theSentences3[i];
            var found = window.find(text);
            var color = ["yellow","blue"];
            if (found) {
                document.execCommand("HiliteColor", false, 
                                     color[colorNum%2]);
                ++colorNum;
                sel.collapseToEnd();
            }
        }
        document.designMode = "off";
}