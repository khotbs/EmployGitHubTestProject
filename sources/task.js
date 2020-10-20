//----------------------------------------------------------------------
//-------------------------Task-----------------------------------------
//----------------------------------------------------------------------

const Task = module.exports = function( aux )
{
    this.id = aux.id;
    this.title = aux.title;
    this.desc = aux.desc;
    this.deadLine = aux.deadLine; //in ms
    this.isComplete = aux.isComplete; //boolean
};

Task.byId = {};

Task.prototype.delete = function()
{
    delete Task.byId[this.id];
};
Task.prototype.edit = function( title, desc, deadLine, isComplete )
{
    this.title = title;
    this.desc = desc;
    this.deadLine = deadLine;
    this.isComplete = isComplete;
};
Task.prototype.toAux = function()
{
    return{
        id : this.id,
        title : this.title,
        desc : this.desc,
        deadLine : this.deadLine, //in ms
        isComplete : this.isComplete //boolean
    };
};

Task.initialise = async function()
{
    ( await Employ.i.mongo.tasks.find().toArray() ).map( task => Task.byId[task.id] = new Task( task ) );
};
Task.add = async function( title, desc, deadLine )
{
    const data = 
    { 
        id: Employ.i.getNumericId(),
        title: title,
        desc: desc,
        deadLine: deadLine,
        isComplete: false 
    };

    await Employ.i.mongo.tasks.insertOne( data ); 
    
    return Task.byId[data.id] = new Task( data );
};