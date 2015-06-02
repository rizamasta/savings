var App = angular.module('savings.controllers',[]);

App.controller('AppCtrl', function($scope,isLogin) {
  //localStorage.clear();
  isLogin.getLogin();
});

App.controller('LoginCtrl',function($scope,$http,$state,isLogin,urlEncode,urlBase,$ionicLoading,$timeout){
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
  };

    $scope.form= {};
    $scope.loginTask = function(){
      $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Loading');
      $http({
        method : 'POST',
        url    : urlBase.gateway('login'),
        data   : urlEncode.setValue($scope.form),
        headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
      })
          .success(function(data){
            $scope.result = data;
            if($scope.result.message=="success"){
              $scope.authMsg = "";
              $ionicLoading.hide();
              $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Login');
              $timeout(function () {
                $ionicLoading.hide();
                isLogin.setLogin($scope.result);
                $state.go('app.report');
              },2000);

            }
            else{
              $ionicLoading.hide();
              $scope.authMsg = $scope.result.message;
            }

          })
          .error(function(e){
            $scope.showLoading('Jaringan Error');
            $timeout(function () {
              $ionicLoading.hide();
              isLogin.setLogin($scope.result);
              $state.go('app.report');
            },2000);
          });

    };

});

App.controller('ReportCtrl', function($scope,isLogin,$http,urlBase,urlEncode,$ionicLoading) {
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
};
  var data_login = isLogin.getLogin(),
      data_user  = data_login.result[0];
  $scope.data    = {
    username:data_user.user_name
  };
  $scope.loadData = function(){
    $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Loading');
    $http({
    method : 'POST',
    url    : urlBase.gateway('tabungan/report'),
    data   : urlEncode.setValue($scope.data),
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
  })
      .success(function(data){
        $scope.result = data;
        if($scope.result.message=="success"){
          $scope.report   = $scope.result.data;
          $scope.deposit  = $scope.result.deposit[0];
          $scope.debt     = $scope.result.debt[0];
          $scope.pay_debt = $scope.result.pay_debt[0];
          $scope.saldo    = ($scope.deposit.total_deposit-$scope.debt.total_debt)+parseInt($scope.pay_debt.total_pay_debt);
          $ionicLoading.hide();
        }
        else{
          $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>'+$scope.result.message);
          $timeout(function() {
            $ionicLoading.hide();//close the popup after 3 seconds for some reason
          }, 1000);
        }
      })
      .error(function(){
          $scope.showLoading('Jaringan Error');
          $timeout(function() {
            $ionicLoading.hide();//close the popup after 3 seconds for some reason
          }, 1000);
      });
  };
    $scope.loadData();
});

App.controller('addSavings',function($scope,$http,urlBase,urlEncode,isLogin,$timeout,$ionicLoading){
  var data_login = isLogin.getLogin(),
      data_user  = data_login.result[0];
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
  };
  $scope.form = {
    jumlah:1000,
    username:data_user.user_name,
    type:'deposit'
  };
  $scope.simpan = function(){
    if($scope.form.jumlah>=1000){
      $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Menyimpan');
      $http({
        method  : 'POST',
        url     : urlBase.gateway('tabungan/add'),
        data    : urlEncode.setValue($scope.form),
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
      })
          .success(function(data){
            $scope.result   = data;
            $ionicLoading.hide();
            if($scope.result.message =="success"){
              $scope.msg  ="";
              $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Berhasil Menyimpan');
              $timeout(function() {
                $ionicLoading.hide(); //close the popup after 3 seconds for some reason
              }, 1000);

            }
            else{
              $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>'+$scope.result.message);
              $timeout(function() {
                $ionicLoading.hide()//close the popup after 3 seconds for some reason
              }, 1000);
            }
          })
          .error(function (e) {
            $scope.showLoading('Jaringan Error');
            $timeout(function() {
              $ionicLoading.hide();//close the popup after 3 seconds for some reason
            }, 1000);
          })
    }
    else{
      $scope.msg = "Minimal 1000";
    }
  };
});

App.controller('addDebt',function($scope,$http,urlBase,urlEncode,isLogin,$timeout,$ionicLoading){
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
  };
  var data_login = isLogin.getLogin(),
      data_user  = data_login.result[0],
      save;
  $scope.form = {
    jumlah:1000,
    username:data_user.user_name,
    type:'debt'
  };

  $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Loading');
  $http({
    method : 'POST',
    url    : urlBase.gateway('tabungan/report'),
    data   : urlEncode.setValue($scope.form),
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
  })
      .success(function(data){
        $scope.result = data;
        if($scope.result.message=="success"){
          $scope.deposit  = $scope.result.deposit[0];
          $scope.debt     = $scope.result.debt[0];
          $scope.pay_debt = $scope.result.pay_debt[0];
          save            = ($scope.deposit.total_deposit-$scope.debt.total_debt)+parseInt($scope.pay_debt.total_pay_debt);
          $scope.saldo    = save -(save*0.2);
          $ionicLoading.hide();
        }
        else{
          $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>'+$scope.result.message);
          $timeout(function() {
            $ionicLoading.hide();//close the popup after 3 seconds for some reason
          }, 1000);
        }
      })
      .error(function(e){
        $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Jaringan Error');
        $timeout(function() {
          $ionicLoading.hide();//close the popup after 3 seconds for some reason
        }, 1000);
      });
  $scope.simpan = function(){
    $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Menyimpan');
    var max =save -(save*0.2);
    if($scope.form.jumlah<=max){
      $http({
        method  : 'POST',
        url     : urlBase.gateway('tabungan/add'),
        data    : urlEncode.setValue($scope.form),
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
      })
          .success(function(data){
            $scope.result   = data;
            if($scope.result.message =="success"){
              $scope.msg  ="";
              $scope.text = $scope.result.text;
              $timeout(function() {
                $scope.text=""; //close the popup after 3 seconds for some reason
              }, 1000);

            }
            else{
              $scope.msg = $scope.result.message;
            }
          })
          .error(function (e) {
            console.log(e);
            $scope.msg  ="Please Contact Our Support";
          })
    }
    else{
      $scope.msg = "Maximal "+max;
    }
  };
});

App.controller('payDebt',function($scope,$http,urlBase,urlEncode,isLogin,$timeout,$ionicLoading){
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
  };
  var data_login = isLogin.getLogin(),
      data_user  = data_login.result[0],
      save;
  $scope.form = {
    jumlah:0,
    username:data_user.user_name,
    type:'pay-debt'
  };
  $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Loading');
  $http({
    method : 'POST',
    url    : urlBase.gateway('tabungan/report'),
    data   : urlEncode.setValue($scope.form),
    headers: { 'Content-Type' : 'application/x-www-form-urlencoded' }
  })
      .success(function(data){
        $scope.result = data;
        if($scope.result.message=="success"){
          $scope.deposit  = $scope.result.deposit[0];
          $scope.debt     = $scope.result.debt[0];
          $scope.pay_debt = $scope.result.pay_debt[0];
          save            = parseInt($scope.debt.total_debt)- parseInt($scope.pay_debt.total_pay_debt);
          $scope.maximal  = save;
          $scope.form.jumlah = save;
          $ionicLoading.hide();
        }
        else{
          $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>'+$scope.result.message);
          $timeout(function() {
            $ionicLoading.hide();//close the popup after 3 seconds for some reason
          }, 1000);
        }
      })
      .error(function(){
        $scope.showLoading('Jaringan Error');
        $timeout(function() {
          $ionicLoading.hide();//close the popup after 3 seconds for some reason
        }, 1000);
      });
  $scope.simpan = function(){
    $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Menyimpan');
    if($scope.form.jumlah<=save){
      $http({
        method  : 'POST',
        url     : urlBase.gateway('tabungan/add'),
        data    : urlEncode.setValue($scope.form),
        headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
      })
          .success(function(data){
            $scope.result   = data;
            if($scope.result.message =="success"){
              $scope.msg  ="";
              $scope.text = $scope.result.text;
              $ionicLoading.hide();
              $scope.showLoading('<ion-spinner icon="dots"></ion-spinner><br>Berhasil Menyimpan');
              $timeout(function() {
                $ionicLoading.hide(); //close the popup after 3 seconds for some reason
              }, 1000);

            }
            else{
              $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>'+$scope.result.message);
              $timeout(function() {
                $ionicLoading.hide();//close the popup after 3 seconds for some reason
              }, 1000);
            }
          })
          .error(function (e) {
            $scope.showLoading('Jaringan Error');
            $timeout(function() {
              $ionicLoading.hide();//close the popup after 3 seconds for some reason
            }, 1000);
          })
    }
    else{
      $scope.msg = "Maximal "+save;
    }
  };
});

App.controller('LogoutCtrl',function($scope,$state,isLogin,$ionicLoading,$timeout){
  //alert('logout');
  $scope.showLoading = function(messsage){$ionicLoading.show({
    template:messsage
  });
  };
  $scope.showLoading('<ion-spinner icon="android"></ion-spinner><br>Keluar');
  $timeout(function () {
    $ionicLoading.hide();
    localStorage.clear();
    isLogin.getLogin();
  },2000);

});

