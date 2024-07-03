//CRUD operatin using database

const express = require("express")
const fs= require("fs")
const mongoose=require("mongoose")






const app = express()
const PORT=8001

//connection
mongoose.connect("mongodb://127.0.0.1:27017/yt-app-1")
.then(()=>console.log("Mongodb connected"))
.catch((err)=>console.log("mongo error", err))

// schema
const userSchema = new mongoose.Schema({
    FirstName:{
       type:String,
       required: true,
    },
    lastName:{
       type:String,
       
    },
    email:{
       required: true,
       type: String,
       unique: true
 
    },
    jobtitle:{
       type: String,
    },
    gender:{
       type: String,
    },
 }, {timestamps:true});

 // model
const User= mongoose.model("user", userSchema)

//   HTML document rendering for browser
app.get("/users", async(req, res)=>{

    const allDbUsers=await User.find({})
    const html= `
    <ul>
        ${allDbUsers.map((user)=>`<li>${user.FirstName} - ${user.email}</li>`).join("")}
    </ul>`;
    res.send(html);
   
})

// for all devices
// app.get("/api/users", (req, res)=>{
//     return res.json(users)
// })



// Rest API

//GET
// to get all users   it is hybrid server
app.get("/api/users", async(req, res)=>{
    const allDbUsers=await User.find({})

    return res.json(allDbUsers)
})

// for dynamic id routing


// by grouping the routes and it will help in for future changements.
app.route("/api/users/:id")
.get(async(req, res)=>{
    // const id=Number(req.params.id);
    // const user=users.find(user=>user.id===id)
    const user=await User.findById(req.params.id)
    // console.log(user);
    return res.json(user)
})
.put((req, res)=>{
   // todo edit the user with id
   return res.json({status: "pending"})
})
.delete(async(req, res)=>{
    // todo edit the user with id
    await User.findByIdAndDelete(req.params.id)
    return res.json({status: "success"})
})
.patch(async(req,res)=>{
    // todo edit the user with id
    await User.findByIdAndUpdate(req.params.id, {lastName:"verma"})
    return res.json({status: "success"})
})

//middleware
app.use(express.urlencoded({extended:false}))

//POST

app.post("/api/users", async(req, res)=>{
    const body=req.body;
    if (
       !body ||
       !body.first_name ||
       !body.last_name ||
       !body.email ||
       !body.gender ||
       !body.job_title
    ){
        return res.status(400).json({msg: "all fields are req..."})
    }
    // console.log(body);
    // users.push({...body, id: users.length + 1})
    // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data)=>{
    //     return res.status(201).json({status:"succes" ,id: users.length  })
    // })
    const result= await User.create({
        FirstName: body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobtitle:body.job_title
    })
    //   console.log(("result", result));  //creation is done
    return res.status(201).json({msg:"success", id: result._id})
})
 
// //PATCH
// app.patch("/api/users/:id", (req, res)=>{
//     // todo edit the user with id
//     return res.json({status: "pending"})
// })

// //DELETE
// app.delete("/api/users/:id", (req, res)=>{
//     // todo delete the user with id
//     return res.json({status:"pending"})
// })

app.listen(PORT, ()=>console.log(`Server started at Port:${PORT}`))
