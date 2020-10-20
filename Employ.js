"use strict";

const path = require( 'path' );
const fs = require('fs');
const express = require( 'express' );
const Mustache = require( 'mustache' );
const mongodb = new require( "mongodb" )
const app = express()
const port = 3000

app.use( "/", express.static( path.resolve( "./public" ) ) );

app.get( "/", ( req, res ) => 
{
    console.log(" app.get / ");
    const customTags = [ '<%', '%>'];
    let data =
    {
        employ:
        JSON.stringify( {
            users: Employ.User.byId,
            tasks: Employ.Task.byId,
            jobs: Employ.Job.byId
        } )
    }; // do aux

    let output = Mustache.render( fs.readFileSync( "public/main.html", "utf8" ), data, {}, customTags );
    res.send( output );
});
app.get( '/user', function (req, res) 
{
    res.sendFile(path.join(__dirname+'/public/html/user.html'));
})

app.post( '/user', function (req, res) 
{
    res.send('Got a POST request')
})

app.listen( port, () => 
{
    console.log(`Example app listening at http://localhost:${port}`);
});

const Employ = module.exports = global.Employ = function Employ()
{
    this.db;
    this.mongo =
    {
        users: null,
        jobs: null,
        tasks: null
    };
};

Employ.prototype.nextNumericId = (function*() { for( let ni = Date.now(); ; yield ++ni); })();
Employ.prototype.getNumericId = function()
{
    return this.nextNumericId.next().value;
};
Employ.prototype.initialise = function() 
{
    const mc = mongodb.MongoClient( "mongodb://127.0.0.1:27017/admin" );
    
    mc.connect( async ( err ) =>
    {                                                           console.error( "mc.connect err", err );
        this.db = mc.db( "employ" );

        this.mongo.tasks = this.db.collection( "tasks" );
        await Employ.Task.initialise();

        this.mongo.jobs = this.db.collection( "jobs" );
        await Employ.Job.initialise();

        this.mongo.users = this.db.collection( "users" );
        await Employ.User.initialise();
    });
};

Employ.User = require( "./sources/user.js" );
Employ.Task = require( "./sources/task.js" );
Employ.Job = require( "./sources/job.js" );
Employ.Schedule = require( "./sources/schedule.js" );

Employ.i = new Employ;
Employ.i.initialise();

setTimeout( async () => 
{
    // let sengman1 = await Employ.User.add( "Seng Man", 25, "male", "coder" );
    // let modbusModule = await Employ.Job.add( "Modbus", "CRUD-Poll-Write" );
    // let crudTask = await Employ.Task.add( "CRUD", "create retrieve update delete", 9000, false );
    // let pollTask = await Employ.Task.add( "Poll", "read data from modbus device", 6000, false );
    // let writeTask = await Employ.Task.add( "Write", "write value to modbus device", 3000, false );
    
    // await Employ.Job.byId[1602749343073].addTask( crudTask );
    // await Employ.Job.byId[1602749343073].addTask( pollTask );
    // await Employ.Job.byId[1602749343073].addTask( writeTask );
    // await sengman1.addJob( Employ.Job.byId[1602749343073] );
    // Employ.User.byId[1602749343072].addCurrentTask( Employ.Task.byId[1602749534557] );
    // Employ.User.byId[1602749343072].addCurrentTask( Employ.Task.byId[1602749534558] );
    // sengman1.addCurrentTask( Employ.Task.byId[1602749534557] );
    // sengman1.addCurrentTask( Employ.Task.byId[1602749534558] );
    // console.log("=========================")
    // console.dir(sengman, {depth:null})
}, 1000);


