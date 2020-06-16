const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost/IssueTracker';
 
function testWithCallbacks(callback){
    console.log("Testing with callbacks");
    const client = new MongoClient(url,{useNewUrlParser:true});
    client.connect((err,client)=>{
        if(err){
            callback(err);
            return;
        }
        const db= client.db();
        const collection= db.collection('employees');
        const employee= {id :1,name :'A.callback',age:23};
        collection.insertOne(employee,function(err,result){
            if(err){
                client.close();
                callback(err);
                return
            }
            console.log('Result of insert:\n',result.insertedId);
            collection.find({_id: result.insertedId}).toArray(function(err,docs){
                if(err){
                    console.log(err);
                }
                console.log("result: ",docs);
                client.close();
                callback(err);
            });
        });
    });
}
async function testWithAsyncFunction(){
    console.log('Testing with Async');
    const client = new MongoClient(url,{useNewUrlParser:true});
    try{
        await client.connect();
        console.log('Connected to Mongodb');
        const db=client.db();
        const collection=db.collection('employees');
        const employee={id:2, name:'B.async',age:16};
        const result = await collection.insertOne(employee);
        console.log("Result :" ,result.insertedId);
        const docs=await collection.find({_id:result.insertedId}).toArray();
        console.log("Result of find : ",docs);
    }catch(err){
        console.log(err);
    }finally{
        client.close();
    }
} 
testWithCallbacks(function(err){
    if(err){
        console.log(err);
    }
    testWithAsyncFunction();
});
