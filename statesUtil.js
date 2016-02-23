function statesUtil($) {
    var states = [];
    var fuels = [];
    $('select[name="selCombustivel"] option').each(function () {
        fuels.push({
            code: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val()
        });
    });
    
    $('select[name="selEstado"] option').each(function () {
        states.push({
            acronym: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val(),
            fuels: fuels
        });
    });

    
    return states;
}

module.exports = statesUtil;