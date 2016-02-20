var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {
    url = 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp';

    request(url, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var state, type;
            var json = [];

            // Identifier
            $("select[name='selEstado']").filter(function () {
                var data = $(this);

                data.children().each(function () {
                    json.push({
                        state: $(this).val()
                    });
                });
            });


        }
        fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })
    });


    res.send('Check your console.');
})

app.listen('8081');

console.log('Magin happens on port 8081');

exports = module.exports = app;