var request = require( 'request' );
var cheerio = require( 'cheerio' );

module.exports = {
	getData: function(lbcdata, callback)
	{
		var cp = lbcdata.city.match(/([0-9]+)/g); // recuperation du code postal
		if (~~(cp /1000) == 75) //si le code postal correspond a paris
			var url = "https://www.meilleursagents.com/prix-immobilier/paris-"+	cp % 75000 +"eme-arrondissement-" + cp;
		else
			var url = "https://www.meilleursagents.com/prix-immobilier/"+ lbcdata.city;
		request( url, function ( error, response, html){ // requete http au site meilleursagents.fr
            if ( !error && response.statusCode == 200 )
            {
                const $ = cheerio.load( html ); //chargement du html dans le DOM parser
                const medianPriceDivArray = $('div.prices-summary__values div.prices-summary__cell--median'); // selection des objets html contenant les prix moyen
                const xtremPriceDivArray = $('div.prices-summary__values div.prices-summary__cell--muted'); // selection des objets html contenant les prix min et max
                var maData = { // extraction des donnees
                	prixApartLow: parseInt($(xtremPriceDivArray.get(0)).text().replace(/\s/g, ''), 10),
                	prixApartHigh: parseInt($(xtremPriceDivArray.get(1)).text().replace(/\s/g, ''), 10),
                	prixApartMed: parseInt($(medianPriceDivArray.get(0)).text().replace(/\s/g, ''), 10),
                	prixMaisonLow: parseInt($(xtremPriceDivArray.get(2)).text().replace(/\s/g, ''), 10),
                	prixMaisonHigh: parseInt($(xtremPriceDivArray.get(3)).text().replace(/\s/g, ''), 10),
                	prixMaisonMed: parseInt($(medianPriceDivArray.get(1)).text().replace(/\s/g, ''), 10),
                	prixMensueltLow: parseInt($(xtremPriceDivArray.get(4)).text().replace(/\s/g, ''), 10),
                	prixMensuelHigh: parseInt($(xtremPriceDivArray.get(5)).text().replace(/\s/g, ''), 10),
                	prixMensuelMed: parseInt($(medianPriceDivArray.get(2)).text().replace(/\s/g, ''), 10),
                }
                callback(lbcdata, maData);
            }
            else {
                console.log( error );
            }
        })
	}
}