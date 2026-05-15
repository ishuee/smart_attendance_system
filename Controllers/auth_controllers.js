exports.login=(req,res)=>{
  const {email,password}=req.body;
  const db=require('../db/connections');

  if(!email || !password){
    return res.json({message:"all fields required"})
  }

  console.log(email,password)

  if (email === "test@gmail.com" && password === "123") {
    return res.json({ message: "Login success" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};