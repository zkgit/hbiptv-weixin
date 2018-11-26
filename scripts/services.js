// app.factory('httpInterceptor',['$rootScope','$location',function($rootScope,$location){
//     return{
//         'request':function(config){
//              if(config.url.match('.html')==null && config.url.match('.json')==null){
//                 config.url = '/web'+config.url;
//              }
//             return config;
//         }
//     }

// }]);
// (function() {
//     'use strict';
//     var module = angular.module('app.services', []);

//     module.service('settings',['$http','$cookieStore','$q',function ($http,$cookieStore,$q) {
//         var settings = {};
//         return {
//             getsettings:function(){
//                 return '';
//                 // if(settings.settings){
//                 //     return $q.when(settings.settings)
//                 // };
//                 // return $http.get('/settings').then(function(res){
//                 //     settings.settings = res.data.data;
//                 //     settings.settings.employees = ["0-20人","20-99人","100- 499人","500-999人","1000-9999人","10000人以上"];
//                 //     return res.data.data;
//                 // })
//             }
//         }
//     }]);

// }).call(this);