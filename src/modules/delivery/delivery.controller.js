const prisma = require('../../lib/prisma');

const createDelivery = async (req, res) => {

  try {

    const { orderId } = req.body;

    const driver =
      await prisma.driver.findUnique({

        where:{
          userId:req.user.userId
        }

      });

    if(!driver){

      return res.status(404).json({
        error:"Driver not found"
      });

    }

    const delivery =

      await prisma.delivery.create({

        data:{

          orderId,

          driverId:
            driver.id

        }

      });

    await prisma.order.update({

      where:{
        id:orderId
      },

      data:{
        status:
        "DRIVER_ASSIGNED"
      }

    });

    res.status(201)
      .json(delivery);

  }

  catch(err){

    console.log(err);

    res.status(400).json({
      error:err.message
    });

  }

};

const getDeliveries =
async(req,res)=>{

const deliveries=

await prisma.delivery.findMany({

include:{
order:true,
driver:true
}

});

res.json(deliveries);

};

module.exports={
createDelivery,
getDeliveries
};