var request = require('request');
var cheerio = require('cheerio');

function crawl(ville, cp, page,callback){
	var url = "https://www.leboncoin.fr/ventes_immobilieres/offres/ile_de_france/occasions/?o="+ page + "&location=" + ville + "%20" + cp;
	console.log("Crawling " + url + " please make sure this url is valid");
	request.get(url, function (error, response, html) {
        if (!error && response.statusCode == 200){
        	const $ = cheerio.load(html);
            const links = $('section.tabsContent a.list_item'); //selection des lien
            const allOffers = $('nav.f1 span.tabsSwitchNumbers small-hidden tiny-hidden');

            for (var i = 0; i < links.length; i++) {
            	var link =  $(links.get(i)).attr('href');// extraction du href
            	if (link.match(/\/\/www.leboncoin.fr\/ventes_immobilieres\/[0-9]+.htm\?ca=12_s/g))//verifie si il s'agit bien dune offre
            		callback(link);
            };
            crawl(ville, cp, ++page,callback) //on passe a la page suivante
        }
    });
}
module.exports = {
	crawl: crawl
}

//https://www.leboncoin.fr/ventes_immobilieres/offres/ile_de_france/occasions/?o=9&location=Paris%2075017