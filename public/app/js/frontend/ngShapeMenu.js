/**
 * Created by Simone on 05-Nov-15.
 */
var app = angular.module('myapp',['ngSanitize']);

app.directive('ngClickshape',function()
    {
        return{
            restrict:'AE',
            replace:true,
            template:/*'<div ng-bind-html="defImgsrc()"></div>',*/
                '<div ng-repeat="x in shapeArr"> <div ng-bind-html="x"> </div> </div>'

        }
    }
)

app.controller('ngClickcontrol',['$scope','$sce', function($scope,$sce)
    {
        $scope.shapelinks = {shapes:[
            {
                sh_icon: "cube",
                sh_name: "Cube",
                sh_method: "createCube()"
            },
            {
                sh_icon: "sphere",
                sh_name: "Sphere",
                sh_method: "createSphere()"
            },
            {
                sh_icon: "cone",
                sh_name: "Cone",
                sh_method: "createCone()"
            },
            {
                sh_icon: "cylinder",
                sh_name: "Cylinder",
                sh_method: "createCylinder()"
            }
        ]}

        $scope.defImgsrc = function ()
        {
            var iconObj;
            iconObj = $scope.shapelinks;
            inShapeArrHtml = new Array();
            inShapeArrTrustedHtml = new Array();
            for(i=0;i<$scope.shapelinks.shapes.length;i++)
            {
                inShapeArrHtml[i] = '<img src= "app/images/' + iconObj.shapes[i].sh_icon + '.png"' +'alt="'+iconObj.shapes[i].sh_name+ '" width="20%" height= "auto" onclick="' + iconObj.shapes[i].sh_method + '"/>';
                inShapeArrTrustedHtml[i] = $sce.trustAsHtml(inShapeArrHtml[i]);
            }
            return inShapeArrTrustedHtml;//return 'imgsrc/' + iconObj.sh_icon + '.jpg';
        }
        $scope.shapeArr=$scope.defImgsrc();

    }]
)
