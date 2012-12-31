
var typewriter;

window.onload = function(){

	// create instance
	typewriter = new TypeWriter();

	// node
	var node ='what';
	// text
	var text = 'This is javascript library for showing some text like type writer.'
			+ '/br//wt:20/'
			+ 'feature1/wt:40//br/ special character to control/wt:40/ (ex./sls/bk:33/sls/ to delete chars like this)/wt:60//spd-:20//bk:34//spd+:20/'
			+ '/wt:60//sls/spd-:80/sls/ for /spd-:80/typing speed down/spd-:80/ like this)/spd+:160//wt:40//spd-:20//bk:47//spd+:20/'
			+ '/wt:20//br/feature2/wt:40//br/ comming soon ... (developing now)';
	// options
	var options = {
		interval: 30,
		onStart: function(process){
			$('#' + process.data.node).css('backgroundColor', '#fdfdff');
		},
		onEnd: function(process){
			$('#' + process.data.node).css('backgroundColor', '#fff');
		}
	};

	// register for typing
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
	 *  /<XX>:<NUM>/ ... repeat /<XX>/ <NUM> times
	 *                   ex) /bk:3/ -> /bk//bk//bk/
	 * 
	 */
};
