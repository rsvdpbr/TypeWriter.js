
var typewriter;

window.onload = function(){

	typewriter = new TypeWriter();
	var node, text, options;


	node = $('#what');
	text = 'This is javascript library for showing some text like type writer.'
			+ '/br//wt:20/'
			+ 'feature1/wt:40//br/ special character to control/wt:40/'
			+ '/mk/ (ex./sls/bk:33/sls/ to delete chars like this)/wt:60//spd-:20//bk:34//spd+:20/'
			+ '/wt:60//sls/spd-:80/sls/ for /spd-:80/typing speed down/spd-:80/ like this)/spd+:160//wt:40//spd-:20//bkmk//spd+:20/'
			+ '/wt:20//br/feature2/wt:40//br/ comming soon ... (developing now)';
	options = {
		interval: 30,
		onStart: function(process){
			$(process.data.node).css('backgroundColor', '#fdfdff');
		},
		onEnd: function(process){
			$(process.data.node).css('backgroundColor', '#fff');
		}
	};
	typewriter.register(node, text, options);


	node = $('#spechar');
	text = '/mk//call//myFunc//spd-:1/this is a simple example /call//myFunc//bkmk/';
	options = {
		'interval': 1,
		'repeat': true,
		'myFunc': (function(){
			var flag = false;
			return function(process){
				if(flag){
					flag = false;
					$(process.data.node).css('backgroundColor', '#ffffff');
				}else{
					flag = true;
					$(process.data.node).css('backgroundColor', '#fafaff');
				}
			};
		})()
	};
	typewriter.register(node, text, options);


	/**
	 *  control characters
	 *  
	 *  /bk/     ... backspace
	 *  /wt/     ... wait
	 *  /sls/    ... insert slash
	 *  /br/     ... insert br tag
	 *  /spd+/   ... speed up
	 *  /spd-/   ... speed down
	 * 
	 *  /mk/ ... /bkmk/   ... backspace to /mk/
	 *  /call//XXX/       ... call XXX(function name)
	 *
	 *  /<XX>:<NUM>/ ... repeat /<XX>/ <NUM> times
	 *                   ex) /bk:3/ -> /bk//bk//bk/
	 * 
	 */
};
