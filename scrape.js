//var request = require("request");
var rp = require('request-promise');
var cheerio = require('cheerio');

// Utils
var statesUtil = require('./statesUtil.js');
var citiesUtil = require('./citiesUtil.js');

//

var initialUlr = 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp';

var states = [];
var fuels = [];
var cities = [];
var stations = [];

var html;
var weekCode;

var initialOptions = {
    uri: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Index.asp',
    transform: function (body) {
        return cheerio.load(body);
    }
}

var stateOptions = {
    method: 'POST',
    uri: 'http://www.anp.gov.br/preco/prc/Resumo_Por_Estado_Municipio.asp',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        selEstado: '',
        selCombustivel: '',
        selSemana: '870*De 14/02/2016 a 20/02/2016',
        desc_Semana: 'de 14/02/2016 a 20/02/2016'
    },
    transform: function (body) {
        return cheerio.load(body);
    }
}

var cityOptions = {
    method: 'POST',
    uri: 'http://www.anp.gov.br/preco/prc/Resumo_Semanal_Posto.asp',
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
        cod_semana: '870',
        cod_combustivel: '487',
        selMunicipio: '6*CRUZEIRO@DO@SUL'
    }
};

rp(initialOptions)
    .then(function ($) {
        html = $.html();

        // Gets all states and fuel types
        states = statesUtil($);

    })
    .then(function () {
        // For each state
        for (var i = 0; i < 2; i++) {

            // Binds state to cities request
            stateOptions.form.selEstado = states[i].raw;

            // For each fuel type
            for (var j = 0; j < states[i].fuels.length; j++) {

                // Binds fuel to a city request
                stateOptions.form.selCombustivel = states[i].fuels[j].raw;

                //                console.log(stateOptions);

                rp(stateOptions)
                    .then(function (citiesResponse) {
                        weekCode = citiesResponse('#frmAberto input[name="cod_semana"]').val();
                        cities = citiesUtil(citiesResponse, states[i].fuels[j]);
                        console.log(cities);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    })
    .catch(function (err) {
        console.log(err);
    });