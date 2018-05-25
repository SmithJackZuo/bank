/**
 * Created by ztzh_lifu on 2018/3/28.
 */
//function jsBack(data) {
//
//    //alert(JSON.stringify(data));
//    var evt = new MyCustomEvent('deviceBack', { value: '' });
//    evt.emit(document);
//    document.dispatchEvent(deviceBack);
//}
//function MyCustomEvent(type, data) {
//    this.evt = new CustomEvent(type, {
//        detail: data
//    });
//}
//
//MyCustomEvent.prototype.emit = function (ele) {
//    ele = ele || document;
//    ele.dispatchEvent(this.evt);
//}
if(window.history && window.history.pushState) {
    $(window).on('popstate', function() {
        console.log(8888);
        //var hashLocation = location.hash;
        //var hashSplit = hashLocation.split("#!/");
        //var hashName = hashSplit[1];
        //if(hashName !== '') {
        //    var hash = window.location.hash;
        //    if(hash === '') {
        //        alert("你点击了返回键");
        //    }
        //}
    });
    window.history.pushState('forward', null, './#forward');
}
accountMergePlatformApp
    .controller('mergeAccountCtrl', function ($scope, popupbox_custom, $rootScope, $timeout, URLService, Request, $state) {
        var urlParams = location.search;
        console.log(urlParams);
        if (urlParams.indexOf("?") != -1) {
            urlParams = urlParams.substr(1);
        }
        var urlArrary = urlParams.split('&');
        var tokenId = '';
        urlArrary.forEach(function (item) {
            var itemArrary = item.split('=');
            if (itemArrary[0] == 'tokenId') {
                tokenId = itemArrary[1];
                //console.log(tokenId);
            }
        });
        console.log(tokenId);
        $scope.inputClick = function (param) {
            if (param == "1") {
                $scope.phoneChecked = true;
                $scope.pandaChecked = false;
                $scope.currentAccount = $scope.info.phoneAccount;
            }
            else if (param == "2") {
                $scope.phoneChecked = false;
                $scope.pandaChecked = true;
                $scope.currentAccount = $scope.info.pandaAccount;
            }
        };
        Request.post({
            url: URLService.userInfo,
            tokenId: tokenId,
            data: {},
            success: checkSuccessCall,
            error: checkErrorCall
        });
        function checkSuccessCall(data) {
            //console.log(data);
            $scope.requestChannelCode = data.context.requestChannelCode;
            $scope.info.nameParam = data.context.userInfo[0].userName;
            //var accountParamLenth=data.context.userInfo[0].idNo.length -7;
            //var accountParamHide=data.context.userInfo[0].idNo.substr(3,accountParamLenth).replace(/(\d{11})/g,'***********');
            //$scope.info.accountParam=data.context.userInfo[0].idNo.substr(0,3)+accountParamHide+data.context.userInfo[0].idNo.substr(14);
            $scope.info.accountParam = data.context.userInfo[0].idNo;
            //console.log( $scope.info.accountParam);
            var stateCode = data.context.userInfo;
            stateCode.forEach(function (item) {
                if (item.channelCode == "001") {
                    $scope.info.phoneAccount = item.userAccount;
                    //$scope.info.pandaAccount=item.userAccount;
                    $scope.userId = data.context.userInfo[0].userId
                }
                else if (item.channelCode == "002") {
                    //$scope.info.phoneAccount=item.userAccount;
                    $scope.info.pandaAccount = item.userAccount;
                    $scope.userId = data.context.userInfo[1].userId
                }
            })
        }
        function checkErrorCall(data) {
            popupbox_custom.popup({ cont: data.message });
        }
        $scope.nextProgrcess = function () {
            //jsBack();
            //console.log(1);
             if (!$scope.currentAccount) {
                 popupbox_custom.popup({ cont: "请先选择一个账号,再点击下一步!" });
                 return;
             }
             popupbox_custom.popup({
                 cont: "天府一账通生成，以后在天府银行各渠道登录都只能使用" + $scope.currentAccount, popType: "confirm", sureCtrl: function () { $scope.sendCode(true); $scope.isShow = true; }, cancelCtr: function () {
                     $scope.isShow = false;

                 }
             });
        };
        //document.addEventListener('deviceBack', function (evt) {
        //    console.log(555);
        //})
        /*短信验证马遮罩*/
        var keyboardValues = [{
            value: 1,
            type: 'num',
            className: 'key_leftRow'
        }, {
                value: 2,
                type: 'num'
            }, {
                value: 3,
                type: 'num'
            }, {
                value: 4,
                type: 'num',
                className: 'key_leftRow'
            }, {
                value: 5,
                type: 'num'
            }, {
                value: 6,
                type: 'num'
            }, {
                value: 7,
                type: 'num',
                className: 'key_leftRow'
            }, {
                value: 8,
                type: 'num'
            }, {
                value: 9,
                type: 'num'
            }, {
                value: '',
                type: 'space',
                className: 'key_leftRow key_space'
            }, {
                value: 0,
                type: 'num'
            }, {
                value: '',
                type: 'del',
                className: 'key_space key_del'
            }];

        //保存数据
        var baseDataObj = {
            myscope: '',
            codeArray: [{
                value: ''
            }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }],
            codeStr: '',
            timer: null,
            canClose: true
        };
        $scope.info = {};
        //initModal();
        function initModal() {
            baseDataObj.codeArray = [{
                value: ''
            }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }, {
                    value: ''
                }];
            baseDataObj.codeStr = '';
            baseDataObj.timer && $timeout.cancel(baseDataObj.timer);
            baseDataObj.timer = null;
            baseDataObj.canClose = true;
            //var myscope = baseDataObj.myscope;
            //var dataParams = baseDataObj.dataParams;
            //var phoneNumber = dataParams.phoneNumber;//默认这些都是必有值的
            //页面数据
            $scope.info.phoneNumber = ''.replace(/(\d{3})(\d{4})(\d{4})/g, '$1****$3');
            $scope.info.keyboardValues = keyboardValues;
            $scope.info.codeArray = baseDataObj.codeArray;
            $scope.info.codeStyle = {
                'line-height': 48 * (document.body.clientWidth / 375) - 2 + 'px'
            };
            $scope.info.showTime = true;
            $scope.info.timeValue = 60;
            $scope.info.stepStyle = {
                step1: {},
                step2: {
                    opacity: 0,
                    '-webkit-transform': 'translateX(100%)',
                    transform: 'translateX(100%)'
                }
            };
            $scope.info.messgePageStyle = {};
            $scope.info.messgePageStyle1 = {};
            $scope.info.verificationSMSModal1 = {
                '-webkit-transform': 'translateY(0)',
                transform: 'translateY(0)',
                width: '100%',
                height: '100%',
                'background-color': 'rgba(49,55,6s6,0.6)',
                position: 'absolute',
                top: '0',
                left: '0',
                'z-index': '9999',
                'overflow-x': 'hidden'
            };
            //console.log($scope.info);
        }

        function refreshTimer() {
            baseDataObj.timer && $timeout.cancel(baseDataObj.timer);
            baseDataObj.timer = null;
            $scope.info.timeValue = 60;
            $scope.info.showTime = true;
            refresh();
            function refresh() {
                baseDataObj.timer = $timeout(function () {
                    $scope.info.timeValue -= 1;
                    if ($scope.info.timeValue == 0) {
                        $scope.info.showTime = false;
                        $timeout.cancel(baseDataObj.timer)
                    }
                    else {
                        refresh();
                    }

                }, 1000);
            }
        }

        $scope.closeVerificationSMSModal = function () {
            $scope.isShowSure = false;
            $scope.isShow = false;
            $scope.info.verificationSMSModal1 = {
            };
        };
        $scope.closeVerificationSMSModalPage = function () {
            $scope.isShowSure = false;
            $scope.isShow = true;
            $scope.info.messgePageStyle = {
            };
        };
        $scope.clickKeyItem = function (key) {
            if (key.type == 'space') {
                return;
            }
            else if (key.type == 'del') {
                var len = baseDataObj.codeStr.length;
                if (len > 0) {
                    baseDataObj.codeArray[len - 1].value = '';
                    baseDataObj.codeStr = baseDataObj.codeStr.substr(0, len - 1);
                }
            }
            else if (key.type == 'num') {
                var len = baseDataObj.codeStr.length;
                if (len < 6) {
                    $scope.info.codeArray[len].value = key.value;
                    baseDataObj.codeStr = baseDataObj.codeStr + key.value;
                    if (len == 5) {
                        nextStep(1);
                        baseDataObj.canClose = false;
                        //此处表示输入满6位，自动提交
                        // isShowStepStyel=true;
                        console.log(88888);
                        checkCode();

                    }
                }
            }
        };
        $scope.sendCode = function () {
            Request.post({
                url: URLService.messageService,
                tokenId: tokenId,
                data: { userAccount: $scope.currentAccount },
                success: function (data) {
                    popupbox_custom.popup({ 'head': '验证码', 'cont': data.message });
                    if (initModal) {
                        initModal();
                    }
                    refreshTimer();
                }, error: function (error) {
                    $scope.isShow = false;
                    $scope.isShowSure = false;
                    popupbox_custom.popup({ 'cont': error.message });
                }
            });
        };
        function checkCode() {
            Request.post({
                url: URLService.validateCode,
                tokenId: tokenId,
                data: { userAccount: $scope.currentAccount, code: baseDataObj.codeStr },
                success: function (data) {
                    //console.log(58);
                    $scope.info.waitingStyle = {
                        opacity: 0
                    };
                    $scope.info.finishStyle = {
                        opacity: 1
                    };
                    baseDataObj.canClose = true;
                    $scope.info.checkResult = '验证码验证通过';
                    Request.post({
                        url: URLService.confirmMerge,
                        tokenId: tokenId,
                        data: { userId: $scope.userId },
                        success: function (data) {
                            // $scope.isLoginAccount = data.context.isLoginAccount;
                            // var urlPosition=data.context.backUrl;
                            console.log($scope.isLoginAccount);
                            $state.go('complate')
                            $rootScope.backUrl = data.context.backUrl;
                            $rootScope.currentAccount = $scope.currentAccount;
                            // window.location.href = data.context.backUrl;
                            // $state.go('')
                            //$scope.code=data.code;
                            //if( $scope.code=="00"){
                            //    Request.post({
                            //        url:URLService.confirmMerge,  //待定
                            //        tokenId:tokenId,
                            //        data:{isLoginAccount:$scope.isLoginAccount},
                            //        success:function(data){
                            //            //console.log(15);
                            //        },error:function(error) {
                            //        }});
                            //}
                            //else if($scope.code=="01"){
                            //
                            //}
                            //console.log(15);
                        }, error: function (error) {
                            popupbox_custom.popup({ 'cont': error.message });
                        }
                    });
                },
                error: function (error) {
                    baseDataObj.canClose = true;
                    //baseDataObj.myscope.info.checkResult = error.message;
                    popupbox_custom.popup({
                        'cont': error.message, 'sureCtrl': function () {
                            baseDataObj.codeStr = '';
                            baseDataObj.codeArray.forEach(function (item) {
                                item.value = '';
                            });
                            prevStep(2);
                        }
                    });

                }
            });
        }
        function nextStep(current) {
            $scope.info.stepStyle['step' + current] = {
                '-webkit-transform': 'translateX(-100%)',
                transform: 'translateX(-100%)'
            };

            $scope.info.stepStyle['step' + (current + 1)] = {
                'z-index': 0,
                opacity: 1,
                '-webkit-transform': 'translateX(0)',
                transform: 'translateX(0)'
            };
            $timeout(function () {
                $scope.info.stepStyle['step' + current].opacity = 0;
            }, 500);
        }
        function prevStep(current) {
            if (current == 1) {
                return;
            }
            $scope.info.stepStyle['step' + current] = {
                'z-index': -1,
                '-webkit-transform': 'translateX("100%")',
                transform: 'translateX("100%")'
            };

            $scope.info.stepStyle['step' + (current - 1)] = {
                opacity: 1,
                '-webkit-transform': 'translateX("0")',
                transform: 'translateX("0")'
            };

            $timeout(function () {
                $scope.info.stepStyle['step' + current].opacity = 0;
            }, 500);

        }

        $scope.showMessage = function () {
            $scope.isShowSure = true;
            $scope.info.messgePageStyle = {
                '-webkit-transform': 'translateY(0)',
                transform: 'translateY(0)'
            };
        };
        $scope.showMessage1 = function () {
            $scope.messageShow = true;
            console.log(555);
            // $state.go('complate') ;   
            $scope.info.messgePageStyle1 = {
                '-webkit-transform': 'translateY(0)',
                transform: 'translateY(0)'
            };
        };
        $scope.closeMessage = function () {
            $scope.messageShow = false;
            $scope.info.messgePageStyle1 = {
            };

        }
    })
    .controller('nextPageCtr', function ($scope, popupbox_custom, $timeout, URLService, Request, $state) {
        $scope.nextProgrcess1 = function () {
            $state.go('mergeAccount');
        }
    })
    .controller('complateCtr', function ($scope, popupbox_custom, $timeout, $rootScope, URLService, Request, $state) {
        $scope.dataUrl = $rootScope.backUrl;
        $scope.phoneNumber = $rootScope.currentAccount;
        console.log($scope.phoneNumber);
        console.log($scope.dataUrl);
        $scope.complateMethod = function () {
            window.location.href = $scope.dataUrl;
        }
    })