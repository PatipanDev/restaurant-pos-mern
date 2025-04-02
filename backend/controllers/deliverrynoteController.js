const DeliveryNote = require('../models/DeliveryNote');
const OrderProduct  = require('../models/OrderProduct')
const Order =  require('../models/Order')
const Supplier = require('../models/Supplier');
 
exports.getDeliveryNote = async(req , res) =>{
    try{
        const deliverynote = await DeliveryNote.find()
            .populate('supplier_Id') 
            .populate('orderproduct_id') 
        const supplier = await Supplier.find();
        const orderProduct = await OrderProduct.find();
        
        res.status(200).json({
            message:'ดึงข้อมูลสำเร็จ',
            deliverynote,
            supplier,
            orderProduct
        })

    }catch(error){
        console.log("Error fetching DeliveryNote", error),
        res.status(500).json({
            message: "เกิดข้อผิดพลาดในการดึงข้อมูลใน server",
            error: error.message // ส่ง error message เพื่อช่วย debug
        })
    }
}

exports.postDeliveryNote = async(req,res)=> {
    const {sender_Name, receiver_Name, description, shipment_Date, delivery_Status,  supplier_Id, orderproduct_id} = req.body
    try{
        let deliverynote = new DeliveryNote({
            sender_Name: sender_Name,
            receiver_Name: receiver_Name,
            description: description,
            shipment_Date: shipment_Date,
            delivery_Status: delivery_Status,
            supplier_Id: supplier_Id,
            orderproduct_id: orderproduct_id
        })

        await deliverynote.save()
        res.status(200).json({
            message: 'เพิ่มข้อมูลสำเร็จ',
            data: deliverynote
        })

    }catch(error){
        console.log("Errpr add data deliverynont", error)
        res.status(500).json({
            message:'เกิดข้อผิดพลาดในการเพิ่มข้อมูล server'
        })
    }
}