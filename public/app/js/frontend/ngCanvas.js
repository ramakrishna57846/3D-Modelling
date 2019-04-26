/**
 * Created by Simone on 10-Nov-15.
 */
var canvasApp = angular.module("canApp",[]);
/*canvasApp.directive('DrawingCanvas', function(){
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '<div ng-include="Url.url"></div>'
    }

})*/

canvasApp.controller('canAppController',['$scope', function($scope){
    $scope.Url = {url:'app/canvas/canvas.html'}
}])