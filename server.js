const express=require('express');
const routes=require('./routes/auth_routes');
const app=express();
const port=process.env.PORT||3000;

app.use(express.json());
app.get('/',(req,res)=>{
  res.send('server running');
})

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use('/auth',routes);

app.listen(port,()=>{
  console.log('server running on port 3000');
})