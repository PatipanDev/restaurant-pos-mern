import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
    family: 'Noto Sans Thai Looped',
    src: '/fonts/NotoSansThaiLooped-Medium.ttf', // ใช้ path ที่อยู่ใน `public/`
});

// สร้างสไตล์ด้วย StyleSheet ของ react-pdf
const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
  section: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    margin: 4,
    fontFamily: 'Noto Sans Thai Looped', // กำหนดให้ใช้ฟอนต์ที่ลงทะเบียน
  },
  table: {
    flexDirection: 'column', // ใช้ flex สำหรับจัดการตาราง
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#000',
    padding: 5,
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
});

// ประเภทของ props ที่รับเข้ามา
interface ReceiptPDFProps {
  receipt: Array<any>;
  orderFoodDetails: Array<any>;
  orderDrinkDetails: Array<any>;
}

const ReceiptPDF: React.FC<ReceiptPDFProps> = ({ receipt, orderFoodDetails, orderDrinkDetails }) => {
  const renderFoodTable = () => {
    return (
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>ลำดับ</Text>
          <Text style={styles.tableCell}>ชื่ออาหาร</Text>
          <Text style={styles.tableCell}>ราคา (บาท)</Text>
          <Text style={styles.tableCell}>จำนวน</Text>
          <Text style={styles.tableCell}>รวม (บาท)</Text>
        </View>
        {orderFoodDetails.map((item, index) => (
          <View style={styles.tableRow} key={item._id}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item?.food_Id?.food_Name}</Text>
            <Text style={styles.tableCell}>
              {parseFloat(item.food_Id.food_Price.$numberDecimal)}
            </Text>
            <Text style={styles.tableCell}>{item?.orderDetail_Quantity}</Text>
            <Text style={styles.tableCell}>
              {parseFloat(item.food_Id.food_Price.$numberDecimal) *
                parseFloat(item?.orderDetail_Quantity)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDrinkTable = () => {
    return (
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>ลำดับ</Text>
          <Text style={styles.tableCell}>ชื่อเครื่องดื่ม</Text>
          <Text style={styles.tableCell}>ราคา (บาท)</Text>
          <Text style={styles.tableCell}>จำนวน</Text>
          <Text style={styles.tableCell}>รวม (บาท)</Text>
        </View>
        {orderDrinkDetails.map((item, index) => (
          <View style={styles.tableRow} key={item._id}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={styles.tableCell}>{item?.drink_Id?.drink_Name}</Text>
            <Text style={styles.tableCell}>
              {parseFloat(item.drink_Id?.drink_Price)}
            </Text>
            <Text style={styles.tableCell}>{item?.orderDetail_Quantity}</Text>
            <Text style={styles.tableCell}>
              {parseFloat(item.drink_Id?.drink_Price) *
                parseFloat(item?.orderDetail_Quantity)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPaymentDetails = () => {
    return (
      <View>
        {receipt.map((item) => (
          <View key={item._id}>
            <Text style={styles.text}>
              วิธีการชำระเงิน: {item?.payment_Id?.payment_Method}
            </Text>
            <Text style={styles.text}>
              เงินที่รับมา: {parseFloat(item?.payment_Id?.received_Amount?.$numberDecimal)} บาท
            </Text>
            <Text style={styles.text}>
              เงินทอน: {parseFloat(item?.payment_Id?.change_Amount?.$numberDecimal)} บาท
            </Text>
            <Text style={styles.text}>
              เงินที่ชำระ: {parseFloat(item?.payment_Id?.paid_Amount?.$numberDecimal)} บาท
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {receipt.map((item) => (
          <View key={item._id} style={styles.section}>
            <Text style={styles.text}>
              โต๊ะ: {item?.order_Id?.table_Id?.number}
            </Text>
            <Text style={styles.text}>
              ออเดอร์: #{item?.Receipt_ID}
            </Text>
            <Text style={styles.text}>
              วันที่: {new Date(item?.createdAt).toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
              เวลา: {new Date(item?.createdAt).toLocaleTimeString()}
            </Text>

            <Text style={styles.text}>รายการอาหาร</Text>
            {renderFoodTable()}

            <Text style={styles.text}>รายเครื่องดื่ม</Text>
            {renderDrinkTable()}

            {renderPaymentDetails()}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
