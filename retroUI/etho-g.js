function tabCtrl($scope){

    $scope.tabs=['logo','hvac','rsrc','lighting'];

    $scope.switchTab = function(tab){
        // remove active class from the current active tab and tab-content and add it to the clicked tab
        //tab manipulation
        $('.active.tab-icon').removeClass('active');
        $('#'+tab+'-icon').addClass('active');
        //tab-content manipulation
        $('.active.tab-content').removeClass('active');
        $('#'+tab+'-content').addClass('active');
    };
}
function hvacCtrl($scope){

}
function rsrcCtrl($scope){

}
function lightingCtrl($scope){

}