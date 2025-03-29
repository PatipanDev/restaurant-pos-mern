// const Supplier = require('../models/Supplier')
// const express = require('express');
// const router = express.Router();

// exports.getSupplier = async (req , res) =>{
//     try{
//         const supplier = await Supplier.find()
//         res.status(200).json({
//             'message': 'ดึงข้อมูลสำเร็จ',
//             supplier
//         })
//     }catch(error){
//         console.log("Error fetching supplier",error)
//         res.status(500).json({
//             'message': 'เกิดข้อผิดพลาด',
//             error: error.message
//         })
        
//     }
// }

// exports.appSupplier = async (req, res)=>{
//     const {supplier_Address, supplier_Name, supplier_Phone, supplier_Name_Owner,supplier_Details } = req.body;
//     try{
//         const supplier = Supplier.findOne({supplier_Name, supplier_Phone})

//     }
// }