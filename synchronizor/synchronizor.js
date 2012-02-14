steal( 'jquery/controller','jquery/view/ejs','jquery/event/key','./synchronizor.css' )
	.then( './views/init.ejs', function($){

/**
 * @class Chromie.Synchronizor
 * A timeline-synchronizor controller class.
 */
$.Controller('Chromie.Synchronizor',
/** @Static */
{
	defaults : {
		canvas: {
			C : 50,
			R : 50 + 10,
			r : 50 - 10,
			x : 75,
			y : 75
		},
		timeline: {
			C: 60,
			R: 50,
			x: 75,
			y: 75,
			r: 40
		},
		color: ['black', 'red', 'orange', 'green', 'blue', 'purple', 'yellow']
	}
},
/** @Prototype */
{
	clock_number: new Array(),
	init : function(){
		var self = this;
		this.element.html("./views/init.ejs",{}, function(){
			self.renderClock();
		});
	},
	'#reset click': function(el, ev){
		this.clock_number = [];
		this.render();
		this.renderHistroy([]);
	},
	'{document} keypress': function(el, ev){
		steal.dev.log(ev.keyName());
		switch(ev.keyName()){
		case '\b':
		case '0':
			this.pop();
			break;
		case '1':
		case '2':
		case '3':
		case '4':
		case '5':
		case '6':
			this.push(Number(ev.keyName()));
			break;
		}
	},
	pop: function(){
		this.clock_number.pop();
		this.render();
	},
	push: function(number){
		if(this.clock_number.length > 12)
		{
			return;
		}
		else
		{
			this.clock_number.push(number);
			this.render();
		}
	},
	divergence: function(current, attractor_fields, paths, dir){
		var self = this;
		var value = attractor_fields[current];
		if(value == null) 
		{
			steal.dev.log('d-mail failed!');
			return false;
		}
		//paths.push(attractor_fields[current].toString()+'['+(current+1)+']'+dir);
		paths.push(current);
		attractor_fields[current] = null;
		if(paths.length == attractor_fields.length)
		{
			this.renderSolution(paths);
			this.renderHistroy(paths);
			steal.dev.log('steins;gate!:'+paths.toString());
			if(this.element.find('#steinsgate img').length > 0)
				this.element.find('#steinsgate').html('');
			this.element.find('#steinsgate').append(paths.toString()+'<br/>');
			return true;
		}
		var path_fork1 = paths.slice();
		var path_fork2 = paths.slice();
		var af1 = attractor_fields.slice();
		var af2 = attractor_fields.slice();
		return this.divergence((attractor_fields.length+current+value)%attractor_fields.length, af1, path_fork1, '+'+value) || this.divergence((attractor_fields.length+current-value)%attractor_fields.length, af2, path_fork2, '-'+value);	
	},
	traverse: function(){
		var self = this;
		var dmail = this.timeleap();
		if(dmail.length> 2) {
			this.element.find('#steinsgate').html('<span style="color:red;">IMPOSSIBLE!</span>');
			return;
		}
		else if(dmail.length == 1) {
			//this.element.find('#steinsgate').append('#steinsgate found!'+dmail[0]+'<br/>');
			var path = '';
			var af0 = self.clock_number.slice();
			var array = new Array();
			self.divergence(dmail[0], af0, array, '{start}');
		}
		else
			$.each(this.clock_number, function(index, value){
				var path = '';
				var af0 = self.clock_number.slice();
				var array = new Array();
				return !self.divergence(index, af0, array, '{start}');
			});
	},
	timeleap: function(){
		var a = this.clock_number.slice(), self = this, dmail = new Array();
		$.each(this.clock_number, function(index, value){
			a[(self.clock_number.length+index+value)%self.clock_number.length] = 'pass';
			a[(self.clock_number.length+index-value)%self.clock_number.length] = 'pass';
		});
		$.each(a, function(index, value){
			if(value != "pass")
			{
				dmail.push(index);
				steal.dev.log('No body reaches '+(index+1)+':'+value);
			}
		});
		return dmail;
	},
	check_timeline: function(array){
		var cleared = true;
		$.each(array, function(index, value){
			if(value!=null)
			{
				cleared = false;
				return false;
			}
		});
		return cleared;
	},
	af_count: 0,
	render: function(){
		this.element.find('#timeline').html(this.clock_number.toString());
		this.element.find('#steinsgate').html('<img src="../leaping.gif" />');
		//this.renderClock();
		this.renderClock();
		this.renderHistroy([]);
		if(this.clock_number.length<1) return;
		var solution = this.traverse(0, this.clock_number, '');
		if(this.element.find('#steinsgate img').length > 0)
		{
			this.element.find('#steinsgate').html('<span style="color:red;">IMPOSSIBLE!</span>');
			return;
		}
	},
	renderClock: function(){
		var canvas = this.element.find('#canvas canvas')[0], self = this;
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		var options = self.constructor.defaults.canvas;
		ctx.arc(options.x,options.y,options.C,0,Math.PI*2,true); // 外圈
		ctx.font= 'bold 18px sans-serif';
		$.each(this.clock_number, function(index, value){
			ctx.fillStyle = self.constructor.defaults.color[value];
			ctx.fillText(value, options.x-6+options.r*Math.sin(2*Math.PI*index/(self.clock_number.length)), options.y+6-options.r*Math.cos(2*Math.PI*index/(self.clock_number.length)));   
		});
		ctx.stroke();
	},
	renderHistroy: function(a) {
		var canvas = this.element.find('#histroy canvas')[0], self = this;
		var ctx = canvas.getContext("2d");
		var options = self.constructor.defaults.timeline;
		var b = new Array(a.length);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		$.each(a, function(index, value){
			b[value] = index+1;;
		});
		var temp = this.clock_number.slice();
		$.each(b, function(index, value){
			ctx.font= 'bold 18px sans-serif';
			ctx.beginPath();
			ctx.fillStyle = "grey";
			ctx.arc(options.x + 2*index*(options.R+5),options.y,options.R,0,Math.PI*2,true); // 外圈
			ctx.fill();
			ctx.closePath();
			ctx.beginPath();
			ctx.fillStyle = "white";
			ctx.arc(options.x + 2*index*(options.R+5),options.y,options.R-15,0,Math.PI*2,true); // 外圈2
			ctx.fill();
			ctx.closePath();
			ctx.strokeStyle = "black";
			$.each(temp, function(i, v){
				if(i == a[index])
				{
					ctx.beginPath();
					ctx.fillStyle = "black";
					ctx.arc(2*index*(options.R+5)+options.x+options.r*Math.sin(2*Math.PI*i/(self.clock_number.length)), options.y-options.r*Math.cos(2*Math.PI*i/(self.clock_number.length)), 10, 0, Math.PI*2, true);   
					ctx.stroke();
					ctx.closePath();
					ctx.fillStyle = "darkgrey";
				}
				else
				{
					ctx.fillStyle = self.constructor.defaults.color[v];
				}

				ctx.fillText(v, 2*index*(options.R+5)+options.x-6+options.r*Math.sin(2*Math.PI*i/(self.clock_number.length)), options.y+6-options.r*Math.cos(2*Math.PI*i/(self.clock_number.length)));   
			});
			ctx.font= 'bold italian 40px sans-serif';
			ctx.fillStyle = 'black';
			ctx.fillText(index+1, 2*index*(options.R+5)+options.x-6, options.y+6);   
			temp[a[index]] = '';
		});
	},
	renderSolution: function(a){
		var canvas = this.element.find('#canvas canvas')[0], self = this;
		var ctx = canvas.getContext("2d");
		var options = self.constructor.defaults.canvas;
		ctx.beginPath();
		ctx.fillStyle = "black";
		var b = new Array(a.length);
		$.each(a, function(index, value){
			b[value] = index+1;;
		});
		$.each(b, function(index, value){
			ctx.fillText(value, options.x-6+options.R*Math.sin(2*Math.PI*index/(a.length)), options.y+6-options.R*Math.cos(2*Math.PI*index/(a.length)));   
		});
		ctx.stroke();
	}
})

});
