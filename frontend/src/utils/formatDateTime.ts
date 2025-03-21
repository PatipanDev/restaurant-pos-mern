export const formatDateTime = (dateInput: string | Date) => {
    const date = new Date(dateInput); // รับทั้ง string หรือ Date object
  
    const formattedDate = date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  
    const formattedTime = date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return { formattedDate, formattedTime }; // ส่งกลับเป็นอ็อบเจกต์
  };
