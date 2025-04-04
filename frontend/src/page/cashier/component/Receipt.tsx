import React, { useState, useEffect } from "react";
import axios from "axios";

// กำหนดชนิดข้อมูลที่รับมาจาก API สำหรับใบเสร็จ
interface Item {
    name: string;
    price: number;
}

interface OrderDetails {
    orderId: string;
    paymentMethod: string;
    paymentStatus: string;
    totalAmount: number;
    items: Item[];
}

interface ReceiptProps {
    id: string; // กำหนดว่า id ต้องเป็น string
}

const Receipt: React.FC<ReceiptProps> = ({ id }) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null); // ข้อมูลใบเสร็จ
    const [loading, setLoading] = useState<boolean>(true); // สถานะการโหลด
    const [error, setError] = useState<string | null>(null); // ข้อความแสดงเมื่อเกิดข้อผิดพลาด

    // ดึงข้อมูลใบเสร็จจาก API
    useEffect(() => {
        const fetchReceiptData = async () => {
            try {
                const response = await axios.get("/api/getReceiptData"); // URL ของ API
                setOrderDetails(response.data); // อัพเดตข้อมูลใบเสร็จ
                setLoading(false);
            } catch (err) {
                setError("ไม่สามารถดึงข้อมูลใบเสร็จได้");
                setLoading(false);
            }
        };

        fetchReceiptData();
    }, []);

    // ฟังก์ชันพิมพ์ใบเสร็จ
    const handlePrint = () => {
        window.print(); // เรียกคำสั่งพิมพ์
    };

    // เมื่อข้อมูลยังโหลด
    if (loading) return <div>กำลังโหลด...</div>;

    // หากเกิดข้อผิดพลาดในการดึงข้อมูล
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>คำสั่งซื้อของคุณ</h1>
            {orderDetails ? (
                <div className="receipt">
                    <h2>ใบเสร็จ</h2>
                    <p>วันที่: {new Date().toLocaleDateString()}</p>
                    <p>เวลา: {new Date().toLocaleTimeString()}</p>
                    <p>หมายเลขคำสั่งซื้อ: {orderDetails.orderId}</p>
                    <p>วิธีการชำระเงิน: {orderDetails.paymentMethod}</p>
                    <hr />
                    <h3>รายการสินค้า</h3>
                    <ul>
                        {orderDetails.items.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.price} บาท
                            </li>
                        ))}
                    </ul>
                    <hr />
                    <p>รวม: {orderDetails.totalAmount} บาท</p>
                    <p>สถานะการชำระเงิน: {orderDetails.paymentStatus}</p>
                    <button onClick={handlePrint}>ปริ้นใบเสร็จ</button>
                </div>
            ) : (
                <div>ไม่พบข้อมูลใบเสร็จ</div>
            )}
        </div>
    );
};

export default Receipt;
