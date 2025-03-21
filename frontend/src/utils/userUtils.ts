export function getUserId(): string {
    const userFromStorage: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(userFromStorage);
    if (parsedUser && parsedUser.customer_Id) {
      return parsedUser.customer_Id;
    }
    return ''; // หรือจะส่งค่าที่เหมาะสม เช่น null
  }