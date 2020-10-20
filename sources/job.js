//----------------------------------------------------------------------
//-------------------------Job-----------------------------------------
//----------------------------------------------------------------------

const Job = module.exports = function( aux )
{
    this.id = aux.id;
    this.title = aux.title;
    this.tasksById = {};

    for( let taskId of Object.values( aux.tasksById ) )
        this.tasksById[taskId] = taskId;
};

Job.byId = {};

Job.prototype.delete = async function()
{
    await Employ.i.mongo.jobs.deleteOne( { id: this.id } );
    delete Job.byId[this.id];
};
Job.prototype.edit = async function( title )
{
    if( typeof title !== "string" && title ) throw new Error( "title must be a non-empty string" );

    await Employ.i.mongo.jobs.updateOne( { id: this.id }, { $set: { title: title } } );

    this.title = title;
};
Job.prototype.addTask = async function( taskId )
{
    this.tasksById[taskId] = taskId;

    await Employ.i.mongo.jobs.updateOne( { id: this.id }, { $set: { ["tasksById." + taskId]: taskId } } );
};
Job.prototype.toAux = function()
{
    let tasks = [];

    for( let task of Object.values( this.tasksById ) )
        tasks.push( task.toAux() );

    return{
        id : this.id,
        title : this.title,
        desc : this.desc,
        tasksById : tasks
    };
};

Job.initialise = async function()
{
    ( await Employ.i.mongo.jobs.find().toArray() ).map( job => Job.byId[job.id] = new Job( job ) );
};
Job.add = async function( title )
{
    if( typeof title !== "string" && title ) throw new Error( "title must be a non-empty string" );

    const data =
    {
        id: Employ.i.getNumericId(),
        title: title,
        tasksById: {}
    };

    await Employ.i.mongo.jobs.insertOne( data ); 
    
    return Job.byId[data.id] = new Job( data );
};