var request = require("request");
var cheerio = require('cheerio');

var initialUlr = 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp';

var states = [];
var fuels = [];
var cities = [];
var stations = [];

// Gets all states and fuel types
request(initialUlr, function (error, response, body) {
    var $ = cheerio.load(body);

    $('select[name="selEstado"] option').each(function () {
        states.push({
            acronym: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val()
        });
    });

    $('select[name="selCombustivel"] option').each(function () {
        fuels.push({
            code: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val()
        });
    });
    
    //////////////////////////////////////////////////////////////////////
    
    // Gets all cities in a state
    
    // 3 = lines which are headers for the table of contents we want
    var resultsQt = $('#box tr').length - 3;
    
    for (var i = 0; i < 1; i++) {
        request.post({
            url: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: {
                selEstado: states[i]['raw'],
                selCombustivel: '487*Gasolina',
                selSemana: '870*De 14/02/2016 a 20/02/2016',
                desc_Semana: 'de 14/02/2016 a 20/02/2016'
            }
        }, function (error, response, html) {
            var $ = cheerio.load(html);
            
            // 3 = lines which are headers for the table of contents we want
            var resultsQt = $('#box tr').length - 3;

            for (var j = 1; j <= resultsQt; j++) {

                var tableRow = $('#box tr').eq(j + 2).children('td');
                cities.push({
                    name: tableRow.eq(0).text(),
                    statistics: [
                        {
                            type: $('input[name="desc_combustivel"]').val().replace(/[-R$]|\/l/g, '').trim(),
                            consumerPrice: [
                                {
                                    averagePrice: tableRow.eq(2).text().replace(',', '.'),
                                    standardDeviation: tableRow.eq(3).text().replace(',', '.'),
                                    minPrice: tableRow.eq(4).text().replace(',', '.'),
                                    maxPrice: tableRow.eq(5).text().replace(',', '.'),
                                    averageMargin: tableRow.eq(6).text().replace(',', '.')
                                    }
                                ],
                            distributionPrice: [
                                {
                                    averagePrice: tableRow.eq(7).text().replace(',', '.'),
                                    standardDeviation: tableRow.eq(8).text().replace(',', '.'),
                                    minPrice: tableRow.eq(9).text().replace(',', '.'),
                                    maxPrice: tableRow.eq(10).text().replace(',', '.')
                                }
                            ]
                        }
                    ],
                    stations: ''
                });
            }
            console.log(JSON.stringify(cities));
            
        });
    }
});

