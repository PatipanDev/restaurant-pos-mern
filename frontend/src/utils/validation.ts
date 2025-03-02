// utils/validation.ts

export const validateEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return regex.test(email);
};


export const validatePassword = (password: string) => {
  // ตรวจสอบความยาวของรหัสผ่าน
  return password.length >= 6;
};

export const validateName = (name: string) => {
  return name.trim().length > 0;  // ตรวจสอบว่าชื่อไม่เป็นค่าว่าง
};
