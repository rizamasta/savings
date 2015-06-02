/**
 * Created by rizamasta on 6/1/15.
 */
var App = angular.module('savings.config',[]);
App.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })
        .state('app.debet', {
            url: "/debet",
            views: {
                'menuContent': {
                    templateUrl: "templates/debt.html",
                    controller:'addDebt'
                }
            }
        })
        .state('app.report', {
            url: "/report",
            views: {
                'menuContent': {
                    templateUrl: "templates/report.html",
                    controller: 'ReportCtrl'
                }
            }
        })
        .state('app.addSavings', {
            url     : "/addSavings",
            views   :{
                menuContent:{
                    templateUrl :"templates/addSavings.html"
                }
            }
        })
        .state('app.payDebt', {
            url     : "/payDebt",
            views   :{
                menuContent:{
                    templateUrl :"templates/payDebt.html",
                    controller:'payDebt'
                }
            }
        })
        .state('app.logout',{
            url :"/logout",
            views:{
                menuContent:
                {
                    templateUrl :"templates/page/logout.html",
                    controller  : "LogoutCtrl"
                }
            }

        })
        .state('user',{
            url : "/user",
            abstract: true,
            templateUrl:"templates/page/login.html",
            controller:('LogoutCtrl','LoginCtrl')
        })
        .state('user.login',{
            url :"/login",
            templateUrl:"templates/page/login.html",
            controller  : "LoginCtrl"
        })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/report');
});