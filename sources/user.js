//----------------------------------------------------------------------
//-------------------------User-----------------------------------------
//----------------------------------------------------------------------

const User = module.exports = function( aux )
{
    this.id = aux.id;
    this.name = aux.name;
    this.currentWorkingTask = {};
    this.jobId = aux.jobId;

    this.totalTasks = 0;
    this.failTasks = 0;
    this.successTasks = 0;
};

User.byId = {};

User.prototype.delete = async function()
{
    await Employ.i.mongo.users.deleteOne( { id: this.id } );
    delete User.byId[this.id];
};
User.prototype.edit = async function( name )
{
    if( typeof name !== "string" && name ) throw new Error( "name must be a non-empty string" );

    await Employ.i.mongo.users.updateOne( { id: this.id }, { $set: { name: name } } );

    this.name = name;
};
User.prototype.assignJob = async function( jobId )
{
    if( Employ.Job.byId[jobId] ) throw new Error( "jobId not found" );

    await Employ.i.mongo.users.updateOne( { id: this.id }, { $set: { jobId: jobObj.id } } ); 

    this.jobId = jobId;
};
User.prototype.addCurrentTask = function( taskObj )
{
    if( !Employ.Schedule.byTaskId[taskObj.id] )
        Employ.Schedule.add( taskObj.title + this.name, taskObj, this );

    this.currentWorkingTask[taskObj.id] = taskObj;
};
User.prototype.toAux = function()
{
    let cwt = [];

    for( let task of Object.values( this.currentWorkingTask ) )
        cwt.push( task.toAux() );

    return{
        id : this.id,
        name : this.name,
        age : this.age,
        gender : this.gender,
        position : this.position,
        currentWorkingTask : {},
        // job: this.job.toAux(),
        totalTasks : this.totalTasks,
        failTasks : this.failTasks,
        successTasks : this.successTasks
    };
};

User.add = async function( name )
{
    if( typeof name !== "string" && name ) throw new Error( "name must be a non-empty string" );

    const data = 
    { 
        id: Employ.i.getNumericId(),
        name: name,
        currentWorkingTask: {},
        jobId: null,
        totalTasks: 0,
        failTasks: 0,
        successTasks: 0
    };

    await Employ.i.mongo.users.insertOne( data ); 
    
    return User.byId[data.id] = new User( data );
};
User.initialise = async function()
{
    ( await Employ.i.mongo.users.find().toArray() ).map( user => User.byId[user.id] = new User( user ) );
};