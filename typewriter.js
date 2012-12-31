'use strict';

var TypeWriter;

(function(){

	var interval = 50;
	var specialCharTable = {
		'/bk/': function(node){	$(node).text($(node).text().slice(0, -1)); },
		'/wt/': function(node){ return ''; },
		'/sl/': function(node){ return '/'; }
	};
	
	TypeWriter = (function(){
		var queue = [];
		var obj = {};
		obj.status = function(){ console.log(queue); };
		obj.add = function(node, string, param){
			param = param || {};
			var index = queue.length;
			queue[index] = {
				'node': node,
				'string': string,
				'interval': (typeof param.interval !== 'undefined') ? param.interval : interval,
				'onStart': (typeof param.onStart !== 'undefined') ? param.onStart : null,
				'onEnd': (typeof param.onEnd !== 'undefined') ? param.onEnd : null
			};
			if(typeof param.autostart === 'undefined' || param.autostart){
				this.start(index);
			}
		};
		obj.start = function(index){
			if(typeof index === 'undefined') index = false;
			var data = queue.pop();
			var func = (function(){
				var onEnd = data.onEnd;
				var node = data.node;
				var string = [];
				var handler;
				// string to array
				var regexp = /\/(.+?):?([0-9]+)?\//g;
				var i, index, len;
				var specialChars = {};
				while(i = regexp.exec(data.string)){
					specialChars[i.index] = [i[0], i[1], i[2]];
				}
				for(i=0, len=data.string.length; i<len; i++){
					var flag = true;
					for(index in specialChars){
						var sp = specialChars[index];
						if(index == i){
							if(typeof sp[2] === 'undefined'){
								string.unshift('/' + sp[1] + '/');
							}else{
								for(var j=0; j<+sp[2]; j++){
									string.unshift('/' + sp[1] + '/');
								}
							}
							flag = false;
							i = i + sp[0].length - 1;
						}
					}
					if(flag){
						string.unshift(data.string[i]);
					}
				}
				// private function to clear setInterval
				var clear = function(force){
					if(typeof force === 'undefined') force = false;
					if(typeof handler !== 'undefined' && (string.length == 0 || force)){
						var a = clearInterval(handler);
						console.log('clear', a, handler);
						if(onEnd){
							onEnd();
						}
					}
				};
				// public functions
				return {
					'write': function(){
						console.log("startが呼び出されました");
						var chara = string.pop();
						if(typeof specialCharTable[chara] === 'undefined'){
							$('#'+node).append(chara);
						}else{
							var result = specialCharTable[chara]($('#'+node));
							if(typeof result === 'undefined'){
								$('#'+node).append(result);
							}
						}
						clear();
					},
					'setHandler': function(h){
						handler = h;
						clear();
					}
				};
			})();
			if(data.onStart){
				data.onStart();
			}
			var h = setInterval(func.write, data.interval);
			func.setHandler(h);
		};
		return obj;
	})();

})();

