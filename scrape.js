//var request = require("request");
var rp = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

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

rp(initialOptions).then($ => {
    html = $.html();
    // Gets all states and fuel types
    states = statesUtil($);
}).then(() => {
    // For each state
    var promise = Promise.resolve();

    _.forEach(states, state => {
        stateOptions.form.selEstado = state.raw;
        _.forEach(state.fuels, fuel => {
            // Binds fuel to a city request
            stateOptions.form.selCombustivel = fuel.raw;

            promise = rp(stateOptions).then(citiesResponse => {
                weekCode = citiesResponse('#frmAberto input[name="cod_semana"]').val();
                cities = citiesUtil(citiesResponse, fuel);
                console.log(cities);
            }).catch(err => console.log(err));
        });
    });

    return promise;
}).catch(err => console.log(err));