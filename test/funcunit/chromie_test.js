steal("funcunit", function(){
	module("chromie test", { 
		setup: function(){
			S.open("//chromie/chromie.html");
		}
	});
	
	test("Copy Test", function(){
		equals(S("h1").text(), "Welcome to JavaScriptMVC 3.2!","welcome text");
	});
})