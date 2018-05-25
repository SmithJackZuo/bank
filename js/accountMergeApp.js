/**
 * Created by ztzh_lifu on 2018/3/30.
 */
var accountMergePlatformApp = angular.module('accountMergePlatform', ['ui.router', 'angular-popups', 'uiSwitch'])

    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
            .state('mergeAccount', {
                url: '/mergeAccount',
                templateUrl: '../AccountMerge/mergeAccount.html',
                controller: 'mergeAccountCtrl'
            })   
            .state('nextPage', {
                url: '/nextPage',
                templateUrl: '../AccountMerge/nextPage.html',
                controller: 'nextPageCtr'
            })   
            .state('complate', {
                url: '/complate',
                templateUrl: '../AccountMerge/complate.html',
                controller: 'complateCtr'
            })          
        $urlRouterProvider.otherwise('/nextPage');

    });