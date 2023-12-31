/*Status Codes
200 - OK
404 - Not Found
500 - Internal Server Error
411 - Input was incorrect
403 - Returning something you dont have the access to */



const express = require("express")
const app = express() //making instance of express


//Anytime we restart the process the in memory data is reset . that is why we use databases
const users =[{
    name: "John",
    kidneys: [{
        healthy:false
    },
    {
        healthy:true
    }]
}]

app.use(express.json());


//getting info and displaying it using res.json
app.get('/',function (req,res){
    const userName = users[0].name
    const userKidneys = users[0].kidneys
    const numberofKidneys = users[0].kidneys.length
    const HealthyKidneys = userKidneys.filter((value,index) => {
        if (userKidneys[index].healthy === true) {
            return true
        }
        else {
            return false
        }
    })
    const numberofHealthyKidneys = HealthyKidneys.length;
    const numberofUnhealthyKidneys =  numberofKidneys - numberofHealthyKidneys;
    res.json({
        userName,
        numberofKidneys,
        numberofHealthyKidneys,
        numberofUnhealthyKidneys
    })
})

//adding kidney through json displaying it using res.json
app.post("/", function(req,res) {
    const isHealthy = req.body.isHealthy;  //for post request we send data in the body of the request
    users[0].kidneys.push({
        healthy: isHealthy
    })
    res.json({
        msg: "Done"
    })
})
//post json {"isHealthy": true} write in postman

//changing all kidneys to true and displaying it using res.json
app.put("/", function(req,res) {
    // only if atleast one unhealthy kidney is present do this , else return 411
    if (checkOneUnhealthyKidneys()){
        for (let i=0; i<users[0].kidneys.length; i++) {
            users[0].kidneys[i].healthy = true;
        }
        res.json({
            msg: "All kidneys to true"
        })
    }
    else {
        res.status(411).json({
            msg:"No Unhealthy kidneys!"
        })
    }
    
})

app.delete("/", function(req,res){
    // only if atleast one unhealthy kidney is present do this , else return 411
    const userKidneys = users[0].kidneys
    if (checkOneUnhealthyKidneys()){
        const HealthyKidneys = userKidneys.filter((value,index) => {
            if (userKidneys[index].healthy === true) {
                return true
            }
        })
        users[0].kidneys = HealthyKidneys
        res.json({
            msg:"Unhealthy kidneys Deleted"
        })
    }
    else {
        res.status(411).json({
            msg:"You have no Unhealthy Kidney"
        })
    }
    
})


function checkOneUnhealthyKidneys() {
    let atleastOneUnheathyKidney = false;
    for (let i =0; i<users[0].kidneys.length;i++) {
        if(!users[0].kidneys[i].healthy) {
            atleastOneUnheathyKidney = true;
        }
    }
    return atleastOneUnheathyKidney
}


app.listen(3000) //3000 is port


//To view: use portman and localhost:port/