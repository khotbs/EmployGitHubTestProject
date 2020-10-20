app.controller( "userController", function( $scope )
{
    $scope.postData = function( )
    {
        console.log("data");
        Employ.User.add();
    }
});