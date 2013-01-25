function HomeControl($scope, $routeParams, $http) {

  $http.get('data/palette.json').success(function(data) {
    $scope.palettes = data;
  });
  
  $http.get('data/home.json').success(function(data) {
    $scope.panes = data;
    $scope.chartgraphs();
  });

  $scope.curLanguage = 'english';
  $scope.currentcolorpalette = 0;
  $scope.orderProp = 'index';
  $scope.curTemplate = 'partials/home.html';
  $scope.curPage = 'NULL';

}