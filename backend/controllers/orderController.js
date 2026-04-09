import orderFlow from "../queues/orderFlow.js";
import Coupon from "../schema/couponSchema.js";
import Order from "../schema/orderSchema.js";
import User from "../schema/userSchema.js";

export async function getAllPlacedOrder(req,res) {
    let userId, guestId;
    try {
        // console.log("Taha Malik the great")
        const userInfo = req?.userInfo;
        guestId = req?.cookies?.guestId;

        /// we are dealing with the guest
        // console.log(req?.userInfo)
        
        userId = userInfo?.id

        // userId=req?.body?.userId;


        const isUser = !!userId;
        const isGuest = !!guestId;

      
        // console.log()
        if (!isUser) {
            return res.status(400).json({ message: "For viewing the order , you need to login first" })
        }


        // await orderFlow.add({
        //     name: 'task3',           
        //     queueName: 'orderPipeline',
        //     data: {},
        //     children: [
        //         {
        //             name: 'task2', 
        //             queueName: 'orderPipeline',
        //             data: {},
        //             children: [
        //                 {
        //                     name: 'task1', 
        //                     queueName: 'orderPipeline',
        //                     data: { userId:userId },
        //                 }
        //             ]
        //         }
        //     ]
        // });

        // want 3 retires
        for(let i=0;i<3;i++){
            try{
                let result=await User.findById(userId).select("orders").lean()
                let orderIds=result["orders"]
                // console.log(orderIds)     //[ 'ORD-1775641238620-000020', 'ORD-1775641615846-000021' ]
                const orderData=await Order.find({orderId:{$in:orderIds}}).select("orderId paymentStatus status couponId finalAmount products createdAt").sort({createdAt:-1}).lean()
                // console.log(orderData,"Hola")
                for(let j=0;j<orderData.length;j++){
                    if(orderData[j]["couponId"]!==undefined){
                        let couponCode=await Coupon.findById(orderData[j]["couponId"]).select("couponCode").lean()
                        if(couponCode!==null) {
                            couponCode=couponCode["couponCode"]
                            orderData[j]["couponId"]=couponCode
                        }
                    }
                }

                return res.status(200).json({message:"All the placed order data",orderData:orderData})

            }catch(error){
                console.log(error)
                console.log(`retry ${i+1} failed`)
            }
        }

        return res.status(400).json({message:"Some error occured while fetching the order data"})
    } catch (error) {
        console.log(error);
        return resizeBy.status(500).json({ message: "Server failed while fetching all the order placed" })
    }
}