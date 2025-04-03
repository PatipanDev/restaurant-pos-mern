const DeliveryNote = require('../models/DeliveryNote');
const OrderProduct = require('../models/OrderProduct')
const Supplier = require('../models/Supplier');
const DeliveryNoteDetails = require('../models/DeliveryNoteDetails');
const Product = require('../models/Product');
const Unit = require('../models/Unit');

exports.getDeliveryNote = async (req, res) => {
    try {
        const deliverynote = await DeliveryNote.find()
            .populate('supplier_Id')
            .populate('orderproduct_id')
        const supplier = await Supplier.find();
        const orderProduct = await OrderProduct.find();

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            deliverynote,
            supplier,
            orderProduct
        })

    } catch (error) {
        console.log("Error fetching DeliveryNote", error),
            res.status(500).json({
                message: "เกิดข้อผิดพลาดในการดึงข้อมูลใน server",
                error: error.message // ส่ง error message เพื่อช่วย debug
            })
    }
}

exports.postDeliveryNote = async (req, res) => {
    const { sender_Name, receiver_Name, description, shipment_Date, delivery_Status, supplier_Id, orderproduct_id } = req.body
    try {
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

    } catch (error) {
        console.log("Errpr add data deliverynont", error)
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล server',
            error: error.message
        })
    }
}



///รายละเอียดใบส่งของ
exports.getDeliveryNoteDetail = async (req, res) => {
    const { id } = req.params
    try {
        const deliverynotedt = await DeliveryNoteDetails.find({ delivery_Note_Id: id })
            .populate({
                path: 'product_Id',
                populate: { path: 'unitId' } // ดึง unit_Id จาก Product ด้วย
            })
            .populate('delivery_Note_Id')

        //แปลงเป็นค่า number
        const deliverynotedetail = deliverynotedt.map(deliverynote => ({
            ...deliverynote.toObject(),
            delivery_Price: deliverynote.delivery_Price.toString(),
        }))


        const deliverynote = await DeliveryNote.find();

        const product = await Product.find()
            .populate('unitId');

        const unit = await Unit.find();

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            deliverynotedetail,
            deliverynote,
            product
        })
        console.log(deliverynotedetail)
    } catch (error) {
        console.log("Error feching deliverynotdetail", error)
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล server'
        })

    }
}

exports.createDeliveryNoteDetail = async (req, res) => {
    const { delivery_Quantity, delivery_Price, product_Id, delivery_Note_Id } = req.body
    console.log(req.body)
    try {
        let deliverynotedetail = new DeliveryNoteDetails({
            delivery_Quantity: delivery_Quantity,
            delivery_Price: delivery_Price,
            product_Id: product_Id,
            delivery_Note_Id: delivery_Note_Id,
        });

        await deliverynotedetail.save();
        res.status(200).json({
            message: 'เพิ่มข้อมูลสำเร็จ',
            deliverynotedetail
        })
    } catch (error) {
        console.log("Error create deliverynote details fails", error)
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล server',
            error: error.message
        })
    }
}
