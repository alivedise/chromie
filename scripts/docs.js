//js chromie/scripts/doc.js

load('steal/rhino/rhino.js');
steal("documentjs").then(function(){
	DocumentJS('chromie/chromie.html', {
		markdown : ['chromie']
	});
});