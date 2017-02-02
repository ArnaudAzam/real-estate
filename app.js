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
           console.log(madata);
           console.log(lbcdata);
           if (lbcdata.typeBien == "maison"){
                if(lbcdata.pricem < madata.prixMaisonLow)
                    res.send("Bonne Affaire!!");
                if(lbcdata.pricem > madata.prixMaisonHigh)
                    res.send("Arnaque!!");
                else
                    res.send("OK!!");
           }
           if (lbcdata.typeBien == "appartement"){
                if(lbcdata.pricem < madata.prixAppartLow)
                    res.send("Bonne Affaire!!");
                if(lbcdata.pricem > madata.prixAppartHigh)
                    res.send("Arnaque!!");
                else
                    res.send("OK!!");
           }
           //if location...
        });
    });
});

app.listen( 3000, function () {
    console.log( 'App listening on port 3000!' );
});