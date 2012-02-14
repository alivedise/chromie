steal( 'jquery/controller','jquery/view/ejs','jquery/event/key','chromie/synchronizor/synchronizor.css' )
	.then( './views/init.ejs', function($){

/**
 * @class Chromie.Leaper
 */
$.Controller('Chromie.Leaper',
/** @Static */
{
	defaults : {}
},
/** @Prototype */
{
	init : function(){
		this.element.html("//chromie/leaper/views/init.ejs",{
			message: "Hello World"
		});
	}
})

});
