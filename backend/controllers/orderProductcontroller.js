const OrderProduct = require('../models/OrderProduct')
const OrderProductDetail = require('../models/OrderProductDetail');
const Product = require('../models/Product');

exports.getOrderProduct = async (req , res)=>{
    try{
        const orderproduct = await OrderProduct.find()
            .populate('chef_Id') 

        res.status(200).json(
            orderproduct
        );

    }catch(error){
        console.log("Error feching orderproduct",error);
    res.status(500).json({
        'message':'เกิดข้อผิดพลาดในการเพิ่ทข้อมูลในเซิร์พเวอร์',
        error: error.message
    });

    };
};

exports.createOrderProduct = async (req , res)=>{
    const {chef_Id} = req.body;
    console.log(req.body)
    console.log(chef_Id)
    try{
        let orderproduct = new OrderProduct({
            chef_Id: chef_Id,
            order_Status: "Pending"        
        })
        await orderproduct.save()
        res.status(200).json({
            'message': 'สร้างรายการสำเร็จ',
        })

    }catch(error){
        console.log("Error create orderproduct new", error)
        res.status(500).json({
            'message':'เกิดข้อผิดพลาดในการเพิ่มข้อมูล'
        })

    }
}

exports.deleteOrderProduct = async (req , res) =>{
    const {id} = req.params
    try{
        const orderproduct = await OrderProduct.findById(id)
        if(!orderproduct){
            res.status(404).json({'message': 'ไม่พบรายการสินค้า'})
        }else{
            await OrderProduct.deleteOne()
            res.status(200).json({'message': 'ลบรายการสำเร็จ'})
        }
    }catch(error){
        console.log('Error delete Data OrderProduct', error)
        res.status(500).json({
            'message': 'เกิดข้อผิดพลาดในการลบข้อมูลฝั่งเซิร์พเวอร์'
        })

    }
}

exports.getOrderProductDetail = async (req,res)=>{
    const {id} = req.params
    try{
        const orderProductDetail = await OrderProductDetail.find({orderproduct_Id: id})
            .populate("product_Id")
            .populate("orderproduct_Id");

        const product = await Product.find();

        if(orderProductDetail.length === 0){
            res.status(404).json({
                message: 'ไม่มีข้อมูลในฐานระบบ',
                orderProductDetail,
                product
            })
        }else{
            res.status(200).json({
                message: 'ดึงข้อมูลสำเร็จ',
                orderProductDetail,
                product
                
            })
        }
    }catch(error){
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        })
    }
}


exports.createOrderProductDetails = async (req, res)=>{
    const {order_Quantity, order_Detail, product_Id, orderproduct_Id} = req.body
    console.log(req.body)
    try{
        let createOrderProduct = new OrderProductDetail({
            order_Quantity: order_Quantity,
            order_Detail: order_Detail,
            product_Id: product_Id,
            orderproduct_Id: orderproduct_Id
        })

        await createOrderProduct.save()
        res.status(200).json({
            message: 'เพิ่มข้อมูลสำเร็จ',
        })
    }catch(erorr){
        console.log("Error add data OrderPoduct Details" ,erorr)
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล'
        })
    }
}

exports.updateOrderProductDetails = async (req, res) => {
    const { id } = req.params;
    const { order_Quantity, order_Detail, product_Id, orderproduct_Id } = req.body;

    console.log("Request Body:", req.body);

    try {
        // 🔹 ต้องใช้ OrderProductDetail ไม่ใช่ OrderProduct
        const orderProductDetail = await OrderProductDetail.findById(id);

        if (!orderProductDetail) {
            return res.status(404).json({ message: "ไม่พบออเดอร์" }); // 🔹 return ออกไปเลย
        }

        // 🔹 อัปเดตค่าต่างๆ
        orderProductDetail.order_Quantity = order_Quantity;
        orderProductDetail.order_Detail = order_Detail;
        orderProductDetail.product_Id = product_Id;
        orderProductDetail.orderproduct_Id = orderproduct_Id;

        await orderProductDetail.save();

        res.status(200).json({ message: "อัพเดตข้อมูลสำเร็จ", orderProductDetail });

    } catch (error) {
        console.error("Error update data in server", error); // 🔹 แก้ชื่อ error ให้ถูก
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการอัพเดตข้อมูล",
            error: error.message, // 🔹 ส่ง error กลับไปด้วย
        });
    }
};

exports.deleteOrderProductDetail = async (req, res)=>{
    const {id} = req.params
    try{
        const orderproductdetail = await OrderProductDetail.findByIdAndDelete(id);

        if(!orderproductdetail){
            res.status(404).json({
                message: 'ไม่มีข้อมูลในการลบ'
            })
        }
        res.status(200).json({
            message: 'ลบข้อมูลสำเร็จเรียบร้อย'
        })
    }catch(error){
        console.log("Error delete data order product detail")
    }
}

//