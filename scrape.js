var request = require('request');
var cheerio = require('cheerio');
var requestify = require('requestify'); 

var url = 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp';

// Request
request(url, function (error, response, html) {
    'use strict';
    var start = new Date();

    if (!error && response.statusCode === 200) {

        var $ = cheerio.load(html);
        var captcha = '';

        $("#divQuadro label[id*='letra']").each(function () {
            captcha += $(this).text();
        });
        
        console.log(captcha);
//        console.log(html);
        $('#txtValor').val(captcha);

        requestify.post(url, {
                txtValor: captcha
            })
            .then(function (response) {
                // Get the response body
                console.log(response);
            });


        response.responseTime = new Date() - start;
        console.log(response.responseTime + ' ms');

    }
});