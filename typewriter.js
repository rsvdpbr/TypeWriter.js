
var type;

(function(){

	var specialSep = '/??/';
	var backspace = '/bk/';
	var wait = '/wt/';
	var interval = 50;
	
	type = (function(){
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
			if(typeof index === 'undefined') force = false;
			var data = queue.pop();
			var func = (function(){
				var onEnd = data.onEnd;
				var node = data.node;
				var string = [];
				var handler;
				// string to array
				for(var i=0,len=data.string.length; i<len; i++){
					var flag = true;
					if(data.string[i] === specialSep[0]){
						var slicedString = data.string.slice(i, i+specialSep.length);
						if(slicedString == backspace){
							string.unshift(slicedString);
							i = i + backspace.length - 1;
							flag = false;
						}
						if(slicedString == wait){
							string.unshift('');
							string.unshift('');
							i = i + backspace.length - 1;
							flag = false;
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
						if(chara !== backspace){
							$('#'+node).append(chara);
						}else{
							$('#'+node).text($('#'+node).text().slice(0, -1));
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

