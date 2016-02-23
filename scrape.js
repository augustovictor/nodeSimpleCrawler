//var request = require("request");
var rp = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');

// Utils
var statesUtil = require('./statesUtil.js');
var citiesUtil = require('./citiesUtil.js');
var fuelsUtil = require('./fuelsUtil.js');

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

rp(initialOptions).then($ => {
    html = $.html();
    // Gets all states and fuel types
    states = statesUtil($);
    fuels = fuelsUtil($);
}).then(() => {
    // For each state
//    console.log(JSON.stringify(states));

    _.forEach(states, state => {
//        console.log(state.name);
        var promise = Promise.resolve();
        stateOptions.form.selEstado = state.raw;
        
        // Each fuel type
        _.forEach(fuels, fuel => {
//            // Binds fuel to a city request
            stateOptions.form.selCombustivel = fuel.raw;
            console.log(JSON.stringify(stateOptions));
//
            promise = rp(stateOptions).then(citiesResponse => {
                weekCode = citiesResponse('#frmAberto input[name="cod_semana"]').val();
                cities = citiesUtil(citiesResponse, fuel.name);
                state.cities = cities;
//                console.log(JSON.stringify(state));
            }).catch(err => console.log(err));
        });
    });

    return promise;
}).catch(err => console.log(err));