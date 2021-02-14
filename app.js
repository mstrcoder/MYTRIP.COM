const express = require('express');

const app=express();

app.get('/',(req,res)=>{
    res.status(200).json({message:"Hello Express is Here",port:8000})
})



























app.listen(8000,()=>{
    console.log("server listening on Port 8000");
})