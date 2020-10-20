const Employ = function Employ()
{
    this.usersById = {};
};

Employ.initialise = function( data ) // Do not use $http, reduce dependence on AngularJS
{      
    console.log("all data", data)
    Employ.i = new Employ;
    Employ.User.initialise( data.users )
    // $rootScope.Employ = Employ;
};
Employ.i;

Employ.User = function( aux )
{
    this.id = aux.id;
    this.name = aux.name;
    this.age = aux.age;
    this.gender = aux.gender;
    this.position = aux.position;
    this.currentWorkingTask = {};
    this.job;

    this.totalTasks = 0;
    this.failTasks = 0;
    this.successTasks = 0;
};

Employ.User.initialise = function( users )
{
    Object.values( users ).map( user => Employ.i.usersById[user.id] = new Employ.User( user )  )
};
Employ.User.add = function()
{
    console.log("Employ.User.add");

    
}

Employ.Job = function()
{
    this.id = aux.id;
    this.title = aux.title;
    this.desc = aux.desc;
    this.tasksById = {};
};

Employ.Task = function()
{
    this.id = aux.id;
    this.title = aux.title;
    this.desc = aux.desc;
    this.deadLine = aux.deadLine; //in ms
    this.isComplete = aux.isComplete; //boolean
};

Employ.Task = function()
{
    this.title = aux.title;
    this.task = aux.task;
    this.user = aux.user;
};

















