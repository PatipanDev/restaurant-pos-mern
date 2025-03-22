export function getUserId(): string {
    const userFromStorage: any = localStorage.getItem("user");
    const parsedUser = JSON.parse(userFromStorage);
    if (parsedUser && parsedUser.customer_Id) {
      return parsedUser.customer_Id;
    }
    return ''; // หรือจะส่งค่าที่เหมาะสม เช่น null
  }

export function getUserRole(): string[]{
  const userFromStorage: any = localStorage.getItem("user");
  const parsedUser = JSON.parse(userFromStorage);
  if (parsedUser && parsedUser.role) {
    const role: string[] = parsedUser.role;
    return role;
  }
  return []; // หรือจะส่งค่าที่เหมาะสม เช่น null
}