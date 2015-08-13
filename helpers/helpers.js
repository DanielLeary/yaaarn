var cheerio = require('cheerio');

module.exports = {
	
addStoryTags: function(Text)
{
    $ = cheerio.load(Text);
    $('h1').addClass('h1-story');
    $('h2').addClass('h2-story');
    $('h3').addClass('h3-story');
    $('h4').addClass('h4-story');
    $('h5').addClass('h5-story');
    $('h6').addClass('h6-story');
    $('p').addClass('p-story');
    $('div').addClass('div-story');
    $('a').addClass('a-story');
    $('img').addClass('img-story');
    $('span').addClass('span-story');
    $('ul').addClass('ul-story');
    $('ol').addClass('ol-story');
    $('li').addClass('li-story');
    $('blockquote').addClass('blockquote-story');

    $('figcaption').remove();

	return $.html();
},

	
}