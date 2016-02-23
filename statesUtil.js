function statesUtil($) {
    var states = [];
    $('select[name="selEstado"] option').each(function () {
        states.push({
            acronym: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val()
        });
    });
    
    return states;
}

module.exports = statesUtil;