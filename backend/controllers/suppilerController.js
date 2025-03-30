
const Supplier = require('../models/Supplier')
const express = require('express');
const router = express.Router();

exports.getSupplier = async (req , res) =>{
    try{
        const supplier = await Supplier.find();
        res.status(200).json(supplier)
    }catch(error){
        console.log("Error fetching supplier",error)
        res.status(500).json({
            'message': 'เกิดข้อผิดพลาด',
            error: error.message
        })
        
    }
}

exports.appSupplier = async (req, res)=>{
    const {supplier_Address, supplier_Name, supplier_Phone, supplier_Name_Owner,supplier_Details } = req.body;
    console.log(req.body)
    try{
        let supplier = await Supplier.findOne({supplier_Name, supplier_Phone})
        if(supplier){
            return res.status(400).json({
                'message':'ชื่อหรือเบอร์มีอยู่แล้ว ห้ามซ้ำ'
            });
            
        }else{
            supplier = new Supplier({
                supplier_Address,
                supplier_Name,
                supplier_Phone,
                supplier_Name_Owner,
                supplier_Details
            });

            await supplier.save();

             res.status(200).json({
                _id: supplier._id,
                supplier_Address: supplier.supplier_Address,
                supplier_Name: supplier.supplier_Name,
                supplier_Phone: supplier.supplier_Phone, // แก้ไขตัวแปร
                supplier_Name_Owner: supplier.supplier_Name_Owner, // แก้ไขตัวแปร
                // 'message': 'เพิ่มข้อมูลร้านค้าสำเร็จ'
            });
        }

    }catch(error){
        console.log(error)
        res.status(500).json({
            'message': 'เกิดข้อผิดพลาดในเซิอร์เวอร์',
            error: error.message || error
        })

    }
}

exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { 
        supplier_Name,
        supplier_Address,
        supplier_Phone,
        supplier_Name_Owner,
        supplier_Details 
    } = req.body;

    try {
        const supplier = await Supplier.findById(id);
        if (!supplier) return res.status(404).json({ message: 'ไม่พบผู้จำหน่ายที่ต้องการอัปเดต' });

        // อัปเดตข้อมูลผู้จำหน่าย
        supplier.supplier_Name = supplier_Name;
        supplier.supplier_Address = supplier_Address;
        supplier.supplier_Phone = supplier_Phone;
        supplier.supplier_Name_Owner = supplier_Name_Owner;
        supplier.supplier_Details = supplier_Details;

        await supplier.save();

        res.status(200).json({ message: 'อัปเดตข้อมูลผู้จำหน่ายสำเร็จ' });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้จำหน่าย' });
    }
};

exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const supplier = await Supplier.findByIdAndDelete(id);
        
        if (!supplier) {
            return res.status(404).json({ message: 'ไม่พบผู้จำหน่ายที่ต้องการลบ' });
        }

        res.status(200).json({ message: 'ลบข้อมูลผู้จำหน่ายสำเร็จ' });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูลผู้จำหน่าย' });
    }
};