function fuelsUtil($) {

    var fuels = [];

    $('select[name="selCombustivel"] option').each(function () {
        fuels.push({
            code: $(this).val().split('*')[0],
            name: $(this).val().split('*')[1].replace(/@/g, ' '),
            raw: $(this).val()
        });
    });

    return fuels;
}

module.exports = fuelsUtil