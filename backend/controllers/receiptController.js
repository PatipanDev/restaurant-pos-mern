const Receipt = require('../models/Receipt')
const OrderFoodDetail = require('../models/OrderFoodDetail')
const OrderDrinkDetail = require('../models/OrderDrinkDetail')

exports.getReceipt = async (req, res) => {
    const { id } = req.params
    try {
        const receipt = await Receipt.find({ _id: id })
            .populate('payment_Id')
            .populate({
                path: 'order_Id',
                populate: {
                    path: 'table_Id',
                    select: 'number seat_count'
                }
            })
            .populate('cashier_Id')

        const [orderFoodDetails, orderDrinkDetails] = await Promise.all([
            OrderFoodDetail.find({ order_Id: receipt[0].order_Id }) // ใช้ [0] เพื่อดึงรายการแรกใน array
                .populate('food_Id')
                .populate('chef_Id')
                .populate('employee_Id'),
            OrderDrinkDetail.find({ order_Id: receipt[0].order_Id }) // ใช้ [0] เช่นเดียวกัน
                .populate('drink_Id')
                .populate('employee_Id'),
        ]);

        res.status(200).json({
            message: 'ดึงข้อมูลสำเร็จ',
            receipt,
            orderFoodDetails,
            orderDrinkDetails
        })
    } catch (error) {
        console.error('Error getting receipt:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
}