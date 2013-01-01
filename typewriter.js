
(function(window){
	'use strict';

	// Variable declaration
	var TypeWriter,
		WritingProcess,
		// Regular expressions
		regex = {
			// Match special characters
			'getSpecialChars': function(){
				return /\/(.+?):?([0-9]+)?\//g;
			}
		},
		// String for delete mark
		markString = '<!-- MARK -->',
		// Called instead of showing special chars
		specialCharsTable = {
			'/bk/': function(node){	$(node).html($(node).html().slice(0, -1)); },
			'/mk/': function(){ return markString; },
			'/bkmk/': function(node, self){
				var html = $(node).html();
				var deleteSection = html.split(markString).pop();
				var length = deleteSection.length;
				for(var i=0; i<length; i++){
					self.stringArray.push('/bk/');
				}
			},
			'/wt/': function(){ return ''; },
			'/sls/': function(){ return '/'; },
			'/br/': function(){  return '<br />';},
			'/spd\+/': function(node, self){
				self.data.interval--;
				self.resetInterval();
				self.write();
			},
			'/spd\-/': function(node, self){
				self.data.interval++;
				self.resetInterval();
				self.write();
			},
			'/call/': function(node, self){
				var nextString = self.stringArray.pop();
				var funcname = (regex.getSpecialChars()).exec(nextString)[1];
				var func = self.data[funcname];
				return func(self);
			}
		},
		// Return the default parameters to call TypeWriter.add method with
		getDefaultParameter = function(){
			return {
				'interval': 50,
				'autostart': true,
				'repeat': false,
				'onStart': function(){},
				'onWrite': function(){},
				'onEnd': function(){}
			};
		};


	// Constructor of this library's main class
	TypeWriter = function(){
		this.queue = [];
	};
	// Register data to queue and start procee if autoload property is not false
	TypeWriter.prototype.register = function(node, string, param){
		var i,
			obj = getDefaultParameter(),
			index = this.queue.length;
		param = param || {};
		for(i in param){
			obj[i] = param[i];
		}
		obj.node = node;
		obj.string = string;
		this.queue[index] = obj;
		if(obj.autostart){
			return this.start(index);
		}
		return true;
	};
	// Pop queue and start typing
	TypeWriter.prototype.start = function(){
		var data = this.queue.pop();
		if(typeof data !== 'undefined'){
			var process = new WritingProcess(data);
			process.start();
			return process;
		}else{
			return false;
		}
	};


	// Constructor of closure to return function for setInterval
	WritingProcess = function(data){
		this.data = data;
		this.handler = null;
		this.node = $('<span></span>');
		$(this.data.node).append(this.node);
	};
	// Convert string to array
	WritingProcess.prototype.convertStringToArray = function(){
		var i, index, len,
			string = this.data.string,
			specialChars = {},
			result = [],
			regexSpecialChars = regex.getSpecialChars();
		while(i = regexSpecialChars.exec(string)){
			specialChars[i.index] = [i[0], i[1], i[2]];
		}
		for(i=0, len=string.length; i<len; i++){
			var flag = true;
			for(index in specialChars){
				var sp = specialChars[index];
				if(index == i){
					if(typeof sp[2] === 'undefined'){
						result.unshift('/' + sp[1] + '/');
					}else{
						for(var j=0; j<+sp[2]; j++){
							result.unshift('/' + sp[1] + '/');
						}
					}
					flag = false;
					i = i + sp[0].length - 1;
				}
			}
			if(flag){
				result.unshift(string[i]);
			}
		}
		return result;
	};
	// Start process
	WritingProcess.prototype.start = function(){
		this.stringArray = this.convertStringToArray();
		this.data.onStart(this);
		var self = this;
		var handler = window.setInterval(function(){ self.write(); }, this.data.interval);
		this.handler = handler;
	};
	// Reset interval for changing interval time
	WritingProcess.prototype.resetInterval = function(){
		window.clearInterval(this.handler);
		var self = this;
		var handler = window.setInterval(function(){ self.write(); }, this.data.interval);
		this.handler = handler;
	};
	// Clear setInterval set to this process
	WritingProcess.prototype.clearInterval = function(force){
		if(typeof force === 'undefined') force = false;
		if(this.stringArray.length == 0 || force){
			window.clearInterval(this.handler);
			this.data.onEnd(this);
			if(this.data.repeat && !force){
				$(this.node).empty();
				this.start();
			}
		}
	};
	// Write process called by setInterval
	WritingProcess.prototype.write = function(){
		var chara = this.stringArray.pop();
		var specialFunction = specialCharsTable[chara];
		if(typeof specialFunction === 'undefined'){
			$(this.node).append(chara);
		}else{
			var result = specialFunction($(this.node), this);
			if(typeof result !== 'undefined'){
				$(this.node).append(result);
			}
		}
		this.data.onWrite(this);
		this.clearInterval();
	};

	// set TypeWriter to global object
	window.TypeWriter = TypeWriter;

})(window);



