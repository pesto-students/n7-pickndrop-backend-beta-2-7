import {User} from '../models/index.js'
import {send} from '../utils/email.js';
export default app=>{
    app.post("/users/authenticate",async (req,res)=>
    {
        const {email,phone}=req.body;
        const role="user";
        const otp=Math.floor(Math.random()*10E5);
        try{
            const user=await User.findOne({
                email,phone,role
            });
            if(!user){
                const user=new User({
                    email,
                    phone,
                    role
                });
                await user.save();
            }
            await User.updateOne({
                email,
                phone,
                role
            },{
                otp
            });
            await send(email,`Your OTP is ${otp}`);
            res.status(200);
            return res.json({
                email,
                phone,
                role,
            });
        }catch(e){
            console.log(e);
            res.status(500);
            return res.end(e.toString())
        }
    });
    app.post("/driver/authenticate",async (req,res)=>
    {
        const {email,phone}=req.body;
        const role="driver";
        const otp=Math.floor(Math.random()*10E5);
        try{
            const user=await User.findOne({
                email,phone,role
            });
            if(!user){
                const user=new User({
                    email,
                    phone,
                    role
                });
                await user.save();
            }
            await User.updateOne({
                email,
                phone,
                role
            },{
                otp
            });
            await send(email,`Your OTP is ${otp}`);
            res.status(200);
            return res.json({
                email,
                phone,
                role,
            });
        }catch(e){
            console.log(e);
            res.status(500);
            return res.end(e.toString());
        }
    });
    app.post("/otp/authenticate",async (req,res)=>{
        const {otp}=req.body;
        try{
            const user=await User.findOne({
                otp
            });
            if(!user){
                throw "Wrong OTP";
            }
            res.status(200);
            return res.json({
                email:user.email,
                phone:user.phone,
                role:user.role,
            });
        }catch(e){
            console.log(e);
            res.status(500);
            return res.end(e.toString());
        }
    })
}