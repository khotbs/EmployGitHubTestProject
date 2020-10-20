const Schedule = module.exports = function( aux )
{
    this.title = aux.title;
    this.task = aux.task;
    this.user = aux.user;
}

Schedule.byTitle = {};
Schedule.byTaskId = {};

Schedule.add = function( title, task, user )
{
    Schedule.byTaskId[task.id] = Schedule.byTitle[title] = new Schedule( { title: title, task: task, user: user } );

    setTimeout( () => 
    {
        Schedule.byTitle[title].checkProgress();
    }, task.deadLine );

    return Schedule.byTitle[title];
};

Schedule.prototype.checkProgress = function()
{
    for( let user of Object.values( Employ.User.byId ) )
    {
        if( user.currentWorkingTask[this.task.id] )
        {
            if( this.task.isComplete ) ++user.successTasks;
            else ++user.failTasks;
        
            ++user.totalTasks;
            console.log("user", user)
        }
    }
};
Schedule.prototype.toAux = function()
{
    let tasks = [];

    for( let task of Object.values( this.tasksById ) )
        tasks.push( task.toAux() );

    return{
        title : aux.title,
        task : aux.task,
        user : aux.user
    };
};