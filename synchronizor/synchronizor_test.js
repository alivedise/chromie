steal('funcunit').then(function(){

module("Chromie.Synchronizor", { 
	setup: function(){
		S.open("//chromie/synchronizor/synchronizor.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Chromie.Synchronizor Demo","demo text");
});


});