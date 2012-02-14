steal('funcunit').then(function(){

module("Chromie.Leaper", { 
	setup: function(){
		S.open("//chromie/leaper/leaper.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Chromie.Leaper Demo","demo text");
});


});