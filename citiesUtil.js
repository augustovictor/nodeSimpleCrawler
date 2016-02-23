function citiesUtil($, fuelName) {
    var cities = [];
    // 3 = lines which are headers for the table of contents we want
    var resultsQt = $('#box tr').length - 3;

    for (var j = 1; j <= resultsQt; j++) {


        var tableRow = $('#box tr').eq(j + 2).children('td');
        cities.push({
            name: tableRow.eq(0).text(),
            statistics: [
                {
                    type: fuelName,
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
                    ]
        });

    }
    return cities;
}


module.exports = citiesUtil;