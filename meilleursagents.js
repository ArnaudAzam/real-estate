var request = require( 'request' );
var cheerio = require( 'cheerio' );

module.exports = {
	getData: function(lbcdata, callback)
	{
		var url = "https://www.meilleursagents.com/prix-immobilier/"+ lbcdata.city;
		console.log(url);
		request( url, function ( error, response, html){
            if ( !error && response.statusCode == 200 ){ // code status 200 = ok status = 404 505 etc error
                const $ = cheerio.load( html );
                const medianPriceDivArray = $('div.prices-summary__values div.prices-summary__cell--median');
                const xtremPriceDivArray = $('div.prices-summary__values div.prices-summary__cell--muted');
                var maData = {
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