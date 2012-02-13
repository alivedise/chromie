steal(
	'./chromie.css', 			// application CSS file
	'./models/models.js',		// steals all your models
	'./fixtures/fixtures.js',	// sets up fixtures for your models
	'chromie/synchronizor',
	function(){					// configure your application
		$('body').chromie_synchronizor();
	})
