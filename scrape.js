var request = require('request');
var cheerio = require('cheerio');

var url = 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp';

// Request
request(url, function (error, response, html) {
    'use strict';
    var start = new Date();

    if (!error && response.statusCode === 200) {

        var $ = cheerio.load(html),
            captcha = '';

        $("#divQuadro label[id*='letra']").each(function () {
            captcha += $(this).text();
        });

        console.log(captcha);
        response.responseTime = new Date() - start;
        console.log(response.responseTime + ' ms');

    }
});