var request = require( 'request' );
var cheerio = require( 'cheerio' );

module.exports = {
    getData : function (url, callback) {
        request.get(url, function (error, response, html) {
            if (!error && response.statusCode == 200){
                const $ = cheerio.load(html);
                const lbcDataArray = $('section.properties span.value');
                const labels = $('span.property');
                var lbcData = [];
                for (var i = 0; i < labels.length; i++) {
                    var label = $(labels[i]).text().trim();
                    if(label.includes("Prix"))
                        lbcData.price = parseInt($(lbcDataArray.get(i)).text().replace(/\s/g, ''), 10);
                    if(label.includes("Ville"))
                        lbcData.city = $(lbcDataArray.get(i)).text().trim().toLowerCase().replace(/\_|\s/g, '-');
                    if(label.includes("Type"))
                        lbcData.typeBien = $(lbcDataArray.get(i)).text().trim().toLowerCase();
                    if(label.includes("Pi"))
                        lbcData.room = $(lbcDataArray.get(i)).text();
                    if(label.includes("Surface"))
                        lbcData.surface = parseInt($(lbcDataArray.get(i)).text().replace(/\s/g, ''), 10);
                };
                lbcData.pricem = ~~(lbcData.price / lbcData.surface);
                callback(lbcData);
            }
            else {
                console.log(error);
            }
        })
    }
}
