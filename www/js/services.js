/**
 * Created by rizamasta on 6/1/15.
 */
var App = angular.module('savings.services',[]);

App.service('isLogin',function($state){
        this.getLogin = function(){
            if(localStorage['data_user']){

                return JSON.parse(localStorage['data_user']);
            }
            else{
                $state.go('user.login');
            }
        };

        this.setLogin = function(data){
            return localStorage['data_user']=JSON.stringify(data);
        }

    });

App.service('urlEncode',function(){
   this.setValue = function(object,prefix){
           var str = [];
           for(var p in object) {
               if (object.hasOwnProperty(p)) {
                   var k = prefix ? prefix + "[" + p + "]" : p, v = object[p];
                   str.push(typeof v == "object" ?
                       setValue(v, k) :
                   encodeURIComponent(k) + "=" + encodeURIComponent(v));
               }
           }
           return str.join("&");

   }
});

App.service('urlBase',function(){

    this.standard    = function (url){
       return "http://latunsma.com/savings/"+url;

    };
    this.gateway    = function(url){
        return "http://localhost/savings-api/index.php/"+url;
    };
});