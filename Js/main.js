var o = require('FuseJS/Observable');
var dict = require('../Js/DictionaryModule.js');
var interApp = require('FuseJS/InterApp');

var results = o();
var input = o('');
var len = o();
var msg = o('');
var anyAlpha = o(false);
var anyLength = o(false);
var resultsCount = o(0);
var infoCount = o(0);
var showInfo = o(false);
var isReadyToSearch = o(true);
var canAlphaRepeat = o(false);

var find = function(){
	isReadyToSearch.value = false;
	// search for o in all the words
	var inpAsArray = input.value.split(' ').join('').toUpperCase().split(''); // remove spaces and then split into characters
	msg.value =  "searching...please wait";
	results.clear();
	var lenAsNum = parseInt(len.value) || 0;	
	if(anyLength.value === false && lenAsNum == 0){
		msg.value = 'No word length specified.';
		return;
	}
	if(anyAlpha.value === false && inpAsArray.length == 0){
		msg.value = 'No input letters specified.';
		return;
	}
	if(anyAlpha.value === false && anyLength.value === false && inpAsArray.length < lenAsNum)
	{
		msg.value = 'Insufficient input length';
		return;
	}
	
	if(anyAlpha.value && anyLength.value)
	{
		msg.value = 'Too many words. Toggle settings above to reduce word count.'
		return;
	}
	if(anyAlpha.value){
		msg.value = 'Searching all words with ' + len.value + ' letters...';
	}
	if(anyLength.value){
		msg.value = 'Searching all words containing given letters of any length...';
	}

	resultsCount.value = 0;
	dict.allWords.forEach(function(val, index){
		if(anyLength.value === false)
		{
			if(val.length == lenAsNum)
			{
				if(anyAlpha.value === false)
				{
					// Check for the presence of alphabets						
					var found = true;
					for(var i=0;i< lenAsNum;i++)
					{
						var cur = val[i];
						if(inpAsArray.indexOf(cur) == -1){
							found = false;
						}
					}
					if(found){
						resultsCount.value= resultsCount.value + 1;
						if(resultsCount.value <= 400)
						{
							results.add(val);
						}
					}
				}
				else
				{
					resultsCount.value= resultsCount.value + 1;
					if(resultsCount.value <= 400)
					{
						results.add(val);
					}
				}
			}
		}else{
			var found = true;
			for(var i=0;i< val.length;i++)
			{
				var cur = val[i];
				if(inpAsArray.indexOf(cur) == -1){
					found = false;
				}
			}
			if(found){
				resultsCount.value= resultsCount.value + 1;
				if(resultsCount.value <= 400)
				{
					results.add(val);
				}
			}
		}
	});	

	if(canAlphaRepeat.value === false)
	{
		// now filter by alphabet count
		var counts = {};
		var tempCount = {};
		var exactMatch = true;
		var curt= '';
		inpAsArray.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });
		var loopCount = results.length;
		while(loopCount--){
			curt = results.getAt(loopCount);
			tempCount = {};
			curt.split('').forEach(function(r1){ tempCount[r1] = (tempCount[r1] || 0) + 1; });
			exactMatch = true;
			for(it in tempCount)
			{
				if(counts[it] < tempCount[it]){ exactMatch = false;break;}
			}
			if(!exactMatch){
				results.removeAt(loopCount);
			}		
		}
		msg.value = results.length + ' word(s) found';
	}
	else
	{
		if(resultsCount.value > 400)
		{
			msg.value = resultsCount.value + ' word(s) found. Showing first 400 below...';
		}
		else{
			msg.value = results.length + ' word(s) found';
		}
	}
	isReadyToSearch.value = true;
}

var insAll = function(){
	input.value="abcdefghijklmnopqrstuvwxyz";
}

var clear = function(){
	input.value="";	
	len.value = '';
	anyAlpha.value = false;
	anyLength.value = false;
	canAlphaRepeat.value = false;

}
module.exports = {
	results: results,
	search: find,
	input: input,
	length: len,
	msg: msg,
	insAll: insAll,
	clear: clear,
	anyAlpha: anyAlpha,
	anyLength: anyLength,
	showInfo: showInfo,
	canAlphaRepeat: canAlphaRepeat,
	isReadyToSearch: isReadyToSearch,
	toggleLength: function(){
		anyLength.value = !anyLength.value;
	},
	toggleAlpha: function(){
		anyAlpha.value = !anyAlpha.value;
	},
	toggleRpt: function(){
		canAlphaRepeat.value = !canAlphaRepeat.value;
	},
	resetInfo: function(){
		infoCount.value = 0;
		showInfo.value = false;
		anyAlpha.value = false;
		anyLength.value = false;
		canAlphaRepeat.value = false;
	},
	incrInfo: function(){		
		infoCount.value = infoCount.value + 1;
		if(infoCount.value == 11){
			showInfo.value = true;
		}
	},
	launchGitRepoUrl: function(){
		interApp.launchUri("https://www.github.com/mrclan/wordsuggester");
	}
}