var express = require( 'express' );
var lbc = require('./boncoin.js');
var ma = require('./meilleursagents.js');
var app = express();
var bodyParser = require('body-parser');

app.set( 'view engine', 'ejs' );
app.use( '/assets', express.static( 'assets' ) );
app.use(bodyParser.urlencoded({extended: true}));

app.get( '/', function ( req, res ) {
    res.render( 'home', {
        message: 'The Home Page!'
    });
});

app.post('/check', function(req, res) {
    lbc.getData(req.body.lbcurl, function(lbcdata){
        ma.getData(lbcdata, function(lbcdata, madata){
           console.log(lbcdata);
           console.log(madata);
           if (lbcdata.typeBien == "maison")
           {
                if(lbcdata.pricem < madata.prixMaisonLow)
                    res.render( 'result', { result: 'Bonne Affaire!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixMaisonLow,prixmoyen: madata.prixMaisonMed, prixhaut: madata.prixMaisonHigh,
                        prixm2: lbcdata.pricem });
                if(lbcdata.pricem > madata.prixMaisonHigh)
                    res.render( 'result', { result: 'Arnaque!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixMaisonLow, prixmoyen: madata.prixMaisonMed, prixhaut: madata.prixMaisonHigh,
                        prixm2: lbcdata.pricem });
                else
                    res.render( 'result', { result: 'Annonce Ok!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixMaisonLow, prixmoyen: madata.prixMaisonMed, prixhaut: madata.prixMaisonHigh,
                        prixm2: lbcdata.pricem });
           } 
           else if (lbcdata.typeBien == "appartement")
           {
                if(lbcdata.pricem < madata.prixApartLow)
                    res.render( 'result', { result: 'Bonne Affaire!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixApartLow,prixmoyen: madata.prixApartMed, prixhaut: madata.prixApartHigh,
                        prixm2: lbcdata.pricem });
                if(lbcdata.pricem > madata.prixApartHigh)
                    res.render( 'result', { result: 'Arnaque!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixApartLow, prixmoyen: madata.prixApartMed, prixhaut: madata.prixApartHigh,
                        prixm2: lbcdata.pricem });
                else
                    res.render( 'result', { result: 'Annonce Ok!!', ville: lbcdata.city, typebien: lbcdata.typeBien,
                        prixbas: madata.prixApartLow, prixmoyen: madata.prixApartMed, prixhaut: madata.prixApartHigh,
                        prixm2: lbcdata.pricem });
           }
           //if location...
        });
    });
});

app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});