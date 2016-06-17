OverlayHtml = {
    _rootScope: null,
    showNext: function() {
        jQuery('#navNext').show();
    },
    showPrevious: function() {
        jQuery('#navPrev').show();
    },
    _setRootScope: function(key, value) {
        var rootScope = this._getRootScope();
        if (rootScope) {
            rootScope[key] = value;
            rootScope.$apply();
        }
    },
    _getRootScope: function() {
        if (_.isNull(this._rootScope)) {
            var overlayDOMElement = document.getElementById('overlayHTML');
            if ("undefined" != typeof angular && "undefined" != typeof overlayDOMElement) {
                var scope = angular.element(overlayDOMElement).scope();
                if (scope) this._rootScope = scope.$root;
            }
        }
        return this._rootScope;
    },
    isReadyToEvaluate: function(enableEval) {
        this._setRootScope("enableEval", enableEval);
    },
    resetStage: function(){
        this.isReadyToEvaluate(false);
        jQuery('#assessButton').hide();
    },
    sceneEnter: function() {
        this.resetStage();
        enablePrevious();
        enableReload();
        var isItemStage = this.isItemScene();
        if (isItemStage) {
            jQuery('#assessButton').show();
            this._setRootScope("isItemScene", true);

            var currentScene = Renderer.theme._currentScene;
            currentScene.on("correct_answer", function(event) {
                console.log("listener for ", event);

                if (event.type === "correct_answer") {
                    AudioManager.play({asset: "goodjob_sound"});
                }
                jQuery("#goodJobPopup").show();
            });
            currentScene.on("wrong_answer", function(event) {
                console.info("listener for ", event);
                if (event.type === "wrong_answer") {
                    AudioManager.play({asset: "tryagain_sound"});
                }
                jQuery("#tryAgainPopup").show();
            });
        }
    },
    isItemScene: function() {
        var stageCtrl = Renderer.theme._currentScene._stageController;
        if (!_.isUndefined(stageCtrl) && ("items" == stageCtrl._type) && !_.isUndefined(stageCtrl._model)) {
            var modelItem = stageCtrl._model[stageCtrl._index];
            // If FTB item, enable submit button directly
            if(!_.isNull(this._rootScope)){
                var enableEval = (modelItem && modelItem.type == 'ftb') ? true : false;
                this._setRootScope("enableEval", enableEval);
            }
            return true;
        } else {
            return false;
        }
        //return ("undefined" != typeof Renderer.theme._currentScene._stageController && "items" == Renderer.theme._currentScene._stageController._type)? true : false;
    }
};