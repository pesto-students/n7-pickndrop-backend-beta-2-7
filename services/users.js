import {User} from '../models/index.js'
import {send} from '../utils/email.js';
import {STATUS_OK,SERVER_ERROR} from '../constants/index.js';
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
            res.status(STATUS_OK);
            return res.json({
                email,
                phone,
                role,
            });
        }catch(e){
            console.log(e);
            res.status(SERVER_ERROR);
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
            res.status(STATUS_OK);
            return res.json({
                email,
                phone,
                role,
            });
        }catch(e){
            console.log(e);
            res.status(SERVER_ERROR);
            return res.end(e.toString());
        }
    });
    app.post("/otp/authenticate",async (req,res)=>{
        const {otp,email,phone}=req.body;
        try{
            const user=await User.findOne({
                email,
                phone,
                otp
            });
            if(!user){
                throw "Wrong OTP";
            }
            res.status(STATUS_OK);
            return res.json({
                email:user.email,
                phone:user.phone,
                role:user.role,
            });
        }catch(e){
            console.log(e);
            res.status(SERVER_ERROR);
            return res.end(e.toString());
        }
    })
}