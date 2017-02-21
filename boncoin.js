var request = require( 'request' );
var cheerio = require( 'cheerio' );
var ma = require( './meilleursagents.js' )

function getData( url, callback ) {
    request.get( url, function ( error, response, html ) { // requette http au site le bon coin
        if ( !error && response.statusCode == 200 ) {
            const $ = cheerio.load( html );   //chargement du html dans le DOM parser
            const lbcDataArray = $( 'section.properties span.value' ); // selection des objets html contenant les valeurs
            const labels = $( 'span.property' ); // selection des objets html contenant les lables asscocies aux valeurs
            const mainimg = $( 'span.lazyload' );
            var lbcData = [];
            for ( var i = 0; i < labels.length; i++ ) { // extraction des donnees
                var label = $( labels[i] ).text().trim();
                if ( label.includes( "Prix" ) )
                    lbcData.price = parseInt( $( lbcDataArray.get( i ) ).text().replace( /\s/g, '' ), 10 );
                if ( label.includes( "Ville" ) )
                    lbcData.city = $( lbcDataArray.get( i ) ).text().trim().toLowerCase().replace( /\_|\s/g, '-' );
                if ( label.includes( "Type" ) )
                    lbcData.typeBien = $( lbcDataArray.get( i ) ).text().trim().toLowerCase();
                if ( label.includes( "Pi" ) ) // pieces 
                    lbcData.room = $( lbcDataArray.get( i ) ).text();
                if ( label.includes( "Surface" ) )
                    lbcData.surface = parseInt( $( lbcDataArray.get( i ) ).text().replace( /\s/g, '' ), 10 );
            };

            lbcData.pricem = ~~( lbcData.price / lbcData.surface ); // calcul du prix au m2
            lbcData.img = $( mainimg[0] ).attr( 'data-imgsrc' );

            callback( lbcData );
        }
        else {
            console.log( error );
        }
    })
}

module.exports = {
    getData: getData,
    evalOffer: function ( url, callback ) {
        getData( url, function ( lbcdata ) {
            ma.getData( lbcdata, function ( lbcdata, madata ) { // recuperation des prix etalons chez meilleursagent.fr
                var score = [];
                if ( lbcdata.typeBien == "maison" ) // attribution du score en fonction du type de bien
                {
                    score.low = ~~( ( lbcdata.pricem / madata.prixMaisonLow ) * 100 );
                    score.med = ~~( ( lbcdata.pricem / madata.prixMaisonMed ) * 100 );
                    score.high = ~~( ( lbcdata.pricem / madata.prixMaisonHigh ) * 100 );
                }
                else if ( lbcdata.typeBien == "appartement" ) {
                    score.low = ~~( ( lbcdata.pricem / madata.prixApartLow ) * 100 );
                    score.med = ~~( ( lbcdata.pricem / madata.prixApartMed ) * 100 );
                    score.high = ~~( ( lbcdata.pricem / madata.prixApartHigh ) * 100 );

                }
                //if location...
                callback( lbcdata, madata, score );
            })
        })
    }
}
