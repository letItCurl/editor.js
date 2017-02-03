var storage = function () {

    var editor  = codex.editor,
        interval   = null,
        config_ = {
            saveInterval: 1000
        };

    if (!window.localStorage) {

        window.console.warn('LocalStorage is not supported in your browser');
        return;

    }

    var prepare = function (config) {

        config_ = config || config_;

        if (get() && editor.state.blocks.savingDate < get().savingDate)
            editor.notifications.confirm({
                message: 'В вашем браузере сохранена более актаульная версия',
                okMsg: 'Показать',
                cancelMsg: 'Отмена',
                confirm: function () {

                    editor.state.blocks = get();
                    editor.renderer.rerender();
                    init(config_.saveInterval);

                },
                cancel: function () {

                    init(config_.saveInterval);

                }

            });

        return Promise.resolve();

    };

    var init = function (saveInterval) {

        interval = window.setInterval(save, saveInterval);

    };

    var save = function () {

        editor.saver.saveBlocks();

        window.setTimeout(function () {

            var savedBlocks = editor.state.jsonOutput,
                savingDate   = editor.state.savingDate,
                data = {
                    items: savedBlocks,
                    savingDate : savingDate
                };

            window.localStorage['codex.editor.savedData'] = JSON.stringify(data);

        }, 500);

    };

    var get = function () {

        if (!window.localStorage['codex.editor.savedData'])
            return;

        var data = JSON.parse(window.localStorage['codex.editor.savedData']);

        return data;

    };

    var stop = function () {

        window.clearInterval(interval);

    };

    return {
        prepare: prepare,
        init   : init,
        save   : save,
        get    : get,
        stop   : stop,
        config : config_
    };

}();