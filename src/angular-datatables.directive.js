(function(angular) {
    'use strict';

    angular.module('datatables.directive', []).
    value('datatablesTemplateUrl', 'src/angular-datatables.html').
    constant('DT_DEFAULT_OPTIONS', {
        sAjaxDataProp: '',
        aoColumns: []
    }).
    /**
     * This directive is used to tell the "datatable" directive that the table is
     * rendered.
     */
    directive('dtColumnRepeat', function() {
        return {
            restrict: 'A',
            link: function($scope) {
                if ($scope.$last) {
                    $scope.$emit('dt:lastElem');
                }
            }
        };
    }).
    directive('datatable', function($http, DT_DEFAULT_OPTIONS, datatablesTemplateUrl, $timeout) {
        return {
            restrict: 'A',
            scope: {
                dtOptions: '=',
                dtColumns: '='
            },
            templateUrl: datatablesTemplateUrl,
            link: function($scope, $elem) {
                var options = DT_DEFAULT_OPTIONS;

                if (angular.isUndefined($scope.dtOptions)) {
                    throw new Error('The option must be defined!');
                }

                angular.extend(options, $scope.dtOptions);

                // Just some basic validation.
                if (angular.isUndefined(options.sAjaxSource)) {
                    throw new Error('"sAjaxSource" must be defined!');
                }

                // for Angular http inceptors
                if (angular.isUndefined(options.fnServerData)) {
                    options.fnServerData = function(sSource, aoData, resultCb) {
                        $http.get(sSource).then(function(result) {
                            resultCb(result.data);
                        });
                    };
                }

                // Set the columns
                if (angular.isArray($scope.dtColumns)) {
                    options.aoColumns = $scope.dtColumns;
                }

                // Load the datatable! 
                $scope.$on('dt:lastElem', function() {
                    // Add $timeout to be sure that angular has finished rendering before calling datatables
                    $timeout(function() {
                        $elem.dataTable(options);
                    }, 0, false);
                });
            }
        };
    });
})(angular);