var request = require("request");
var cheerio = require('cheerio');
var promise = require('promise');

var json = [];

var optionsCities = {
    method: 'POST',
    url: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
    headers: {
        'postman-token': '590297bc-c1a9-0d8e-e519-1c14c4686e05',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        selEstado: 'AC*ACRE',
        selCombustivel: '487*Gasolina',
        selSemana: '870*De 14/02/2016 a 20/02/2016',
        desc_Semana: 'de 14/02/2016 a 20/02/2016'
    }
};

var optionsStations = {
    method: 'POST',
    url: 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp',
    headers: {
        'postman-token': 'aa168332-3179-dc16-4310-d303388bb2f5',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        cod_semana: '870',
        cod_combustivel: '487',
        selMunicipio: '6*CRUZEIRO@DO@SUL'
    }
};

var cities = [];
var stations = [];


request(optionsCities, function (error, response, body) {
    'use strict';

    if (error) throw new Error(error);

    var $ = cheerio.load(body);


    // 3 = lines which are headers for the table of contents we want
    var resultsQt = $('#box tr').length - 3;



    for (var i = 1; i <= resultsQt; i++) {
        
        // Stations here
request(optionsStations, function (errorsStations, responseStations, body) {
    var $ = cheerio.load(body);

    var stationRow = $('.multi_box3 tr');
    var stationsQt = stationRow.length - 1;

    for (var i = 1; i <= stationsQt; i++) {
        var stationRowCell = stationRow.eq(i).children('td');

        stations.push({
            name: stationRowCell.eq(0).text(),
            address: stationRowCell.eq(1).text(),
            area: stationRowCell.eq(2).children('a').text(),
            flag: stationRowCell.eq(3).text(),
            prices: {
                type: $('.tabela3 > div h3').eq(1).text(),
                sellPrice: stationRowCell.eq(4).text(),
                buyPrice: stationRowCell.eq(5).text(),
                saleMode: stationRowCell.eq(6).text(),
                provider: stationRowCell.eq(7).text(),
                date: stationRowCell.eq(8).text()
            }
        });
    }

    console.log(JSON.stringify(stations));
});
        
        var tableRow = $('#box tr').eq(i + 2).children('td');
        cities.push({
            name: tableRow.eq(0).text(),
            statistics: [
                {
                    type: optionsCities['form'].selCombustivel.split('*')[1],
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
            stations: stations
        });
    }

    //    console.log('Dados');
        console.log(JSON.stringify(cities));
});