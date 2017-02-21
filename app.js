var express = require( 'express' );
var bodyParser = require( 'body-parser' );
var fs = require( 'fs' );
var lbc = require( './boncoin.js' );
var ma = require( './meilleursagents.js' );
var spider = require( './spider.js' );

var app = express();
app.set( 'view engine', 'ejs' );
app.use( '/assets', express.static( 'assets' ) );
app.use( bodyParser.urlencoded( { extended: true }) );

app.get( '/', function ( req, res ) {
    res.render( 'home', {
        message: 'The Home Page!'
    });
});

app.post( '/check', function ( req, res ) {
    lbc.evalOffer( req.body.lbcurl, function ( lbcdata, madata, score ) { // on compare loffre avec les prix au m2
        res.render( 'result', {
            prixtotal: lbcdata.price,
            typebien: lbcdata.typeBien,
            surface: lbcdata.surface,
            city: lbcdata.city,
            prixm2: lbcdata.pricem,
            pieces: lbcdata.room,
            images: lbcdata.img,
            prixmin: ( lbcdata.typeBien == 'appartement' ) ? madata.prixApartLow : madata.prixMaisonLow,
            prixmed: ( lbcdata.typeBien == 'appartement' ) ? madata.prixApartMed : madata.prixMaisonMed,
            prixmax: ( lbcdata.typeBien == 'appartement' ) ? madata.prixApartHigh : madata.prixMaisonHigh,
            scorelow: score.low,
            scoremed: score.med,
            scorehigh: score.high
        });
    });
});

app.post( '/crawl', function ( req, res ) {
    var stream = fs.createWriteStream( "bonnesOffres_" + req.body.cp + ".csv" ); // on ouvre un fichier
    stream.once( 'open', function ( fd ) {
        stream.write( "url, scoremin, scoremed, scoremax\n" ); // on ecrit les header du csv
        spider.crawl( req.body.ville, req.body.cp, 1, function ( url ) { //on parse les offres
            lbc.evalOffer( "https:" + url, function ( lbcdata, madata, score ) { // on les compare avec les prix au m2
                if ( score.low <= 150 && score.med <= 90 ) { // si l'offre est bonne on lajoute au csv
                    console.log( "Ajoutee a la liste: " + url );
                    stream.write( "https:" + url + ", " + score.low + ", " + score.med + ", " + score.high + "\n" );
                }
            });
        });
    });
});

app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});