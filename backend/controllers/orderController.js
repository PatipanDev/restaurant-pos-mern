const Order = require('../models/Order')
const OrderFoodDetail = require('../models/OrderFoodDetail')
const OrderDrinkDetail = require('../models/OrderDrinkDetail')
const Table = require('../models/Table')



exports.createOrderFoodDetail = async (req, res) => {
    try {
        const { customer_Id, orderDetail_More, food_Id, orderDetail_Quantity } = req.body;

        if (!customer_Id || !food_Id || !orderDetail_Quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the latest order for the given customer
        const latestOrder = await Order.findOne({ customer_Id }).sort({ createdAt: -1 });

        if (latestOrder) {
            // Check if there is an existing order detail for the same food in the latest order
            const existingOrderDetail = await OrderFoodDetail.findOne({
                order_Id: latestOrder._id,
                food_Id: food_Id,
            });

            if (existingOrderDetail) {
                // If the food item already exists in the order, update the quantity
                existingOrderDetail.orderDetail_Quantity += orderDetail_Quantity;
                await existingOrderDetail.save();
                return res.status(200).json(existingOrderDetail); // Return updated order detail
            } else {
                // If the food item doesn't exist, create a new order detail
                const newOrderDetail = new OrderFoodDetail({
                    orderDetail_Quantity,
                    orderDetail_Cooking: 'Pending', // Set default cooking status
                    orderDetail_Serving: 'Not Served', // Set default serving status
                    order_Id: latestOrder._id,
                    food_Id,
                    orderDetail_More,
                });

                await newOrderDetail.save();
                return res.status(201).json(newOrderDetail); // Return the new order detail
            }
        } else {
            // If no order exists, create a new order and order detail
            const newOrder = new Order({
                customer_Id,
                order_Status: 'Pending', // Set default order status
                // Add other order fields as needed
            });

            await newOrder.save();

            const newOrderDetail = new OrderFoodDetail({
                orderDetail_Quantity,
                orderDetail_Cooking: 'Pending',
                orderDetail_Serving: 'Not Served',
                order_Id: newOrder._id,
                food_Id,
                orderDetail_More,
            });

            await newOrderDetail.save();
            return res.status(201).json({ order: newOrder, orderDetail: newOrderDetail });
        }
    } catch (err) {
        console.error(err); // เพิ่มการ log ข้อผิดพลาด
        res.status(500).json({ message: "An error occurred while processing the order.", error: err.message });
    }
};


exports.createOrderDrinkDetail = async (req, res) => {
    try {
        const { customer_Id, orderDetail_More, drink_Id, orderDetail_Quantity } = req.body;

        if (!customer_Id || !drink_Id || !orderDetail_Quantity) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Find the latest order for the given customer
        const latestOrder = await Order.findOne({ customer_Id }).sort({ createdAt: -1 });

        if (latestOrder) {
            // Check if there is an existing order detail for the same drink in the latest order
            const existingOrderDetail = await OrderDrinkDetail.findOne({
                order_Id: latestOrder._id,
                drink_Id: drink_Id,
            });

            if (existingOrderDetail) {
                // If the drink item already exists in the order, update the quantity
                existingOrderDetail.orderDetail_Quantity += orderDetail_Quantity;
                await existingOrderDetail.save();
                return res.status(200).json(existingOrderDetail); // Return updated order detail
            } else {
                // If the drink item doesn't exist, create a new order detail
                const newOrderDetail = new OrderDrinkDetail({
                    orderDetail_Quantity,
                    orderDetail_Cooking: 'Pending', // Set default cooking status (or remove if not applicable)
                    orderDetail_Serving: 'Not Served', // Set default serving status
                    order_Id: latestOrder._id,
                    drink_Id: drink_Id,
                    orderDetail_More,
                });

                await newOrderDetail.save();
                return res.status(201).json(newOrderDetail); // Return the new order detail
            }
        } else {
            // If no order exists, create a new order and order detail
            const newOrder = new Order({
                customer_Id,
                order_Status: 'Pending', // Set default order status
                // Add other order fields as needed
            });

            await newOrder.save();

            const newOrderDetail = new OrderDrinkDetail({
                orderDetail_Quantity,
                orderDetail_Cooking: 'Pending', // Set default cooking status (or remove if not applicable)
                orderDetail_Serving: 'Not Served',
                order_Id: newOrder._id,
                drink_Id: drink_Id,
                orderDetail_More,
            });

            await newOrderDetail.save();
            return res.status(201).json({ order: newOrder, orderDetail: newOrderDetail });
        }
    } catch (err) {
        console.error(err); // Log the error
        res.status(500).json({ message: "An error occurred while processing the order.", error: err.message });
    }
};






// exports.getPendingOrdersByCustomer = async (req, res) => {
//     const { id } = req.params;
//     console.log(id)
//     try {
//         // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending"
//         const orders = await Order.find({
//             customer_Id: id,
//             order_Status: 'Pending'
//         })

//         // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
//         if (orders.length === 0) {
//             return res.status(404).json({ message: 'No pending orders found for this customer.' });
//         }

//         // ส่งข้อมูลคำสั่งซื้อที่พบ
//         return res.status(200).json(orders);
//     } catch (error) {
//         console.error('Error fetching pending orders:', error);
//         // ส่งข้อความผิดพลาดในกรณีที่เกิดข้อผิดพลาด
//         return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
//     }
// };

exports.getPendingOrdersByCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const orders = await Order.find({
            customer_Id: id,
            order_Status: 'Pending'
        });

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No pending orders found for this customer.' });
        }

        // ดึงข้อมูล Table ที่เชื่อมโยงกับแต่ละคำสั่งซื้อ
        const tables = await Table.find({});

        // ดึงข้อมูล OrderFoodDetail และ OrderDrinkDetail พร้อมกันด้วย Promise.all
        const [orderFoodDetails, orderDrinkDetails] = await Promise.all([
            OrderFoodDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('food_Id')  // Populate the food details (menu items)
                .populate('chef_Id')  // Optionally, populate other details like chef
                .populate('employee_Id'),  // Optionally, populate employee details
            OrderDrinkDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('drink_Id')  // Populate the drink details (drink items)
                .populate('employee_Id')  // Optionally, populate employee details
        ]);

        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            orders,
            orderFoodDetails,
            orderDrinkDetails,
            tables // เพิ่มข้อมูลโต๊ะ
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};


exports.getInProgressOrdersByCustomer = async (req, res) => {
    const { id } = req.params;
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const orders = await Order.find({ customer_Id: id, order_Status: 'In Progress' }).populate("table_Id", "number seat_count");

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No pending orders found for this customer.' });
        }

        // ดึงข้อมูล Table ที่เชื่อมโยงกับแต่ละคำสั่งซื้อ
        const tables = await Table.find({});

        // ดึงข้อมูล OrderFoodDetail และ OrderDrinkDetail พร้อมกันด้วย Promise.all
        const [orderFoodDetails, orderDrinkDetails] = await Promise.all([
            OrderFoodDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('food_Id')  // Populate the food details (menu items)
                .populate('chef_Id')  // Optionally, populate other details like chef
                .populate('employee_Id'),  // Optionally, populate employee details
            OrderDrinkDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('drink_Id')  // Populate the drink details (drink items)
                .populate('employee_Id')  // Optionally, populate employee details
        ]);

        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            orders,
            orderFoodDetails,
            orderDrinkDetails,
            tables // เพิ่มข้อมูลโต๊ะ
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};





exports.getPendingOrdersByEmployee = async (req, res) => {
    const { _id } = req.params;
    try {
        // ค้นหาข้อมูลออเดอร์ที่สถานะเป็น "Pending" โดยอิงจาก customer_Id
        const orders = await Order.find({ _id: _id, order_Status: 'In Progress' }).populate("table_Id", "number seat_count");

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No pending orders found for this customer.' });
        }

        // ดึงข้อมูล Table ที่เชื่อมโยงกับแต่ละคำสั่งซื้อ
        const tables = await Table.find({});

        // ดึงข้อมูล OrderFoodDetail และ OrderDrinkDetail พร้อมกันด้วย Promise.all
        const [orderFoodDetails, orderDrinkDetails] = await Promise.all([
            OrderFoodDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('food_Id')  // Populate the food details (menu items)
                .populate('chef_Id')  // Optionally, populate other details like chef
                .populate('employee_Id'),  // Optionally, populate employee details
            OrderDrinkDetail.find({ order_Id: { $in: orders.map(order => order._id) } })
                .populate('drink_Id')  // Populate the drink details (drink items)
                .populate('employee_Id')  // Optionally, populate employee details
        ]);

        // ส่งข้อมูลคำสั่งซื้อพร้อมรายละเอียดอาหาร น้ำดื่ม และข้อมูลโต๊ะที่พบ
        return res.status(200).json({
            orders,
            orderFoodDetails,
            orderDrinkDetails,
            tables // เพิ่มข้อมูลโต๊ะ
        });
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        return res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};





















