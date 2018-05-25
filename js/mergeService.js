/**
 * Created by ztzh_lifu on 2018/3/28.
 */
accountMergePlatformApp
    .factory('popupbox_custom', function ($timeout) {
        // 判断设备类型
        var browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;

                return {
                    // 是否为移动终端
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                    // 苹果、谷歌内核
                    webKit: u.indexOf('AppleWebKit') > -1,
                    // 火狐内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                    // android终端或者uc浏览器
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                    // 是否为iPhone或者QQHD浏览器
                    iPhone: u.indexOf('iPhone') > -1
                };
            }(),
            // 检测浏览器使用语言
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        };
        var popupbox_custom = {
            isOpen: false
        };
        var waitList = [];
        var waitStatus = {
            wait: false
        };

        /**
         * 功能：自定义弹出框
         * 参数列表：[head, cont, placehold, popType, sureCtrl, cancelCtrl, sureTxt, cancelTxt,closeCall]
         * 参数“head”：弹出框标题文本
         * 参数“cont”：可选参数,(1)输入文本内容("...文本内容...")；(2)"input-text",将会以文本框显示
         * 参数“placehold”：配置placeholder的提示内容（默认为“请输入内容”）
         * 参数“popType”：按钮区域，可选参数（默认为(1)参数），(1)"alert"只显示确定按钮；(2)"confirm"显示确定取消按钮
         * 参数“sureCtrl”：确定按钮点击后的操作回调
         * 参数“cancelCtrl”：取消按钮点击后的操作回调
         * 参数“sureTxt”：确定按钮显示的文本内容
         * 参数“cancelTxt”：取消按钮显示的文本内容
         * 参数“closeCall”:点击关闭按钮的回调操作
         **/
        function popupbox_text(param, textData) {
            // 初始化参数列表的配置
            //console.log(2);
            if (waitStatus.wait) {
                waitList.push(param);
                return;
            }
            waitStatus.wait = param.wait || false;
            param.head = param.head == undefined ? "温馨提示" : param.head;
            param.cont = param.cont == undefined ? "(未配置显示内容)" : param.cont;
            param.placehold = param.placehold == undefined ? "请输入内容" : param.placehold;
            param.maxlength = param.maxlength = undefined ? undefined : param.maxlength;
            param.popType = param.popType == "confirm" ? "confirm" : "alert";
            param.text = param.text || '';
            popupbox_custom.isOpen = true;
            param.sureCtrl = param.sureCtrl == undefined ? param.sureCtrl = function () {
                closeThisBox();
            } : param.sureCtrl;
            param.cancelCtrl = param.cancelCtrl || function () { };
            //param.cancelCtrl = ((typeof(param.cancelCtrl) != "function") && (param.cancelCtrl != undefined)) ? alert("取消操作的参数必须是一个可执行函数") : (function(){});
            param.sureTxt = param.sureTxt == undefined ? "确定" : param.sureTxt;
            param.cancelTxt = param.cancelTxt == undefined ? "取消" : param.cancelTxt;
            param.closeCall = param.closeCall || function () { };
            // 根据参数类型配置主要内容
            if (param.cont == "input-text") {
                param.cont = '<input type="text" id="pupup_mytext" maxlength="' + param.maxlength + '" value="' + param.text + '" placeholder="' + param.placehold + '">';
            }
            else {
                param.cont = param.cont + "<br/>";
            }

            // 根据参数类型配置弹出框按钮区域
            if (param.popType == "alert") {
                param.popType = '<div class="popup-footer popup-footer-onlyOne"><button type="button" class="sureMesg alertBtn">' + param.sureTxt + '</button></div>';
            }
            else if (param.popType == "confirm") {
                param.popType = '<div class="popup-footer"><button type="button" class="cancelBtn">' + param.cancelTxt + '</button>' +
                    '<button type="button" class="sureMesg" >' + param.sureTxt + '</button></div>';
            }

            // 为插件主容器添加弹出框
            $(".pluginMainBox").append(
                // 弹出框组件主容器
                '<div class="popupbox">' +
                    // 弹出框体
                '<div class="popupbox-text">' +
                    // 弹出框标题
                //'<h1 class="popup-header">' +
                //param.head + (param.code ? '<span class="popup-code"' +
                //'onclick="var self = this;this.style.color=\'#ffb20a\';' +
                //'setTimeout(function(){self.style.color=\'#fff\'}, 1000);">' +
                //param.code + '</span>' : '') +
                //    // '<div class="close-outline"><i class="icon ion-ios-close-outline"></i></div>' +
                //'</h1>' +
                    // 主要内容
                '<div class="popup-content">' +
                param.cont +
                '</div>' +
                    // 弹出框按钮区域
                param.popType +
                '</div>' +
                    // 遮罩层
                '<div class="maskLayer"></div>' +
                '</div>'
            );

            // 实例化弹出框对象
            var $popupBox = $(".popupbox-text");
            //modify by tanglin begin 所有弹出框都显示为一个样式
            // 显示出弹出框
            $popupBox.show();

            // 调整位置
            var popHeight = parseInt($popupBox.outerHeight());
            $popupBox.css({
                "top": "50%",
                "margin-top": -(popHeight / 2) + "px"
            });

            // 是否是移动端
            /*if(browser.versions.mobile || browser.versions.android || browser.versions.ios){
             // 是否是webKit内核
             if(browser.versions.webKit){
             }
             // 是否是Android
             if(browser.versions.android || browser.versions.iPhone) {
             // 显示出弹出框
             $popupBox.show();

             // 调整位置
             var popHeight = parseInt($popupBox.outerHeight());
             $popupBox.css({
             "top": "50%",
             "margin-top": -(popHeight / 2) + "px"
             });
             }
             // 是否是iPhone
             else if(browser.versions.iPhone) {
             // 设置弹出框iPhone风格的样式
             $popupBox.addClass("iPhoneStyle");
             var button_len = $popupBox.children(".popup-footer").find("button").length;
             // 如果是单个确定按钮的情况
             if(button_len == 1) {
             $(".popupbox-text .popup-footer .sureMesg").css("bottom", "20px");
             }
             else {
             $(".popupbox-text .popup-footer .sureMesg").css("top", 0);
             }
             // 显示出弹出框
             $popupBox.show();
             }
             }*/
            //modify end

            /* 关闭弹出框 */
            $(".popupbox:last .close-outline").one("click", function () {
                closeThisBox(this.parentNode.parentNode.parentNode);
                if (typeof param.closeCall == 'function') {
                    $timeout(param.closeCall, 300);
                }

            });

            /* 确认按钮的操作 */
            $(".popupbox:last .sureMesg").one("click", function () {
                var text = $("#pupup_mytext").val();
                $timeout(function () {
                    param.sureCtrl(text);
                }, 300);
                closeThisBox(this.parentNode.parentNode.parentNode);
            });

            /* 取消按钮的操作 */
            $(".popupbox:last .cancelBtn").one("click", function () {
                param.cancelCtrl();
                closeThisBox(this.parentNode.parentNode.parentNode);
            });

            /**
             * 关闭弹出框
             * 提供给返回按钮的关闭功能
             **/
            popupbox_custom.close = function () {
                closeThisBox();
                if (typeof param.closeCall == 'function') {
                    $timeout(param.closeCall, 300);
                }
            };

        }
        /**
         * 功能：关闭弹出框
         * 参数：弹出框触发的关闭的元素（通常为"this"）
         **/
        function closeThisBox(ident) {
            if (ident) {
                var popupbox = $(ident);
            }
            else {
                var popupbox = $(".popupbox:last");
            }
            //为安卓返回按钮设置状态
            if ($('.popupbox').length <= 1) {
                popupbox_custom.isOpen = false;
            }

            // Android关闭效果
            if (browser.versions.android) {
                popupbox.fadeOut(300, function () {
                    popupbox.remove();
                });
            }
            // iPhone关闭效果
            else if (browser.versions.iPhone) {
                //ios必须延时，否则如果确定/取消按钮下方有输入框，键盘会自动弹出，但此时输入框并没有获取焦点（即无法通过点击其他地方失去焦点来关闭键盘）
                $timeout(function () {
                    popupbox.fadeOut(300, function () {
                        popupbox.remove();
                    });
                }, 200);

                // popupbox.animate({
                // "bottom": "-100%"
                // }, 300, function () {
                // popupbox.remove();
                // });
            } else {  //其他效果
                popupbox.fadeOut(300, function () {
                    popupbox.remove();
                });
            }
            $timeout(checkWaitList, 300);
        }

        //清除等待显示的弹出框列表
        function clearWaitList() {
            waitList.length = 0;
        }
        function checkWaitList() {
            waitStatus.wait = false;
            for (var i = 0, len = waitList.length; i < len; i++) {
                var waitItem = waitList.shift();
                popupbox_text(waitItem);
            }
        }
        function setWaitStatus(status) {
            if (status) {
                waitStatus.wait = true;
            } else {
                checkWaitList();
            }
        }

        popupbox_custom.popup = popupbox_text;
        popupbox_custom.closePopup = closeThisBox;
        popupbox_custom.wait = setWaitStatus;
        popupbox_custom.clear = clearWaitList;
        return popupbox_custom;
})
    .factory('URLService', function () {
        return {
              'baseURL':'http://172.32.5.94:20181/uam',//演练环境勿改
             //'baseURL':'http://172.32.10.234:8080/uam',
            //'baseURL':'/uam',//生产环境勿改
            'userInfo':'/mergeAccount/userInfo.htm',
            'messageService':'/mergeAccount/sendMessage.htm',
            'validateCode':'/mergeAccount/validateCode.htm',
            'confirmMerge':'/mergeAccount/confirmMerge.htm',
        }
    })
.factory('Request', ['$http', '$rootScope', '$state', '$location','URLService',
    function ($http, $rootScope, $state, $location,URLService) {
        var endpoint = URLService.baseURL;
        function post(params) {
            var sendUrl = params.absolute ? params.url : (endpoint + params.url);
            var data = params.data || {};
            var successFun = params.success;
            var isShowDefaultError = params.showDefaultError;
            var errorFun = params.error;
            var silence = params.showLoadding;

            $rootScope.loading = true;
            $http.post(sendUrl, data, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'tokenId':params.tokenId
                },
                timeout: 60000
            }).success(function (data) {
                requestSuccess(data);
            }).error(function (data) {
                requestError(data);
            });

            function requestSuccess(data) {
                //console.log('success', data);
                $rootScope.loading = false;
                if (data.code == '00') {
                    if (typeof successFun == 'function') {
                        successFun(data);
                    }
                }else {
                    if (typeof errorFun == 'function') {
                        errorFun(data);
                    }
                }
            }
            function requestError(error) {
                $rootScope.loading = false;
                if (typeof errorFun == 'function') {
                    errorFun(data);
                }
            }
        }
        return {
            'post': post
        }

    }]);