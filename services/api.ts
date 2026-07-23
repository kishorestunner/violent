export const loginApi = async (
  userId: string,
  password: string
) => {
  const users = [
    {
      id: "ADM001",
      password: "123456",
      role: "admin",
      name: "Admin One",
    },
    {
      id: "ADM002",
      password: "123456",
      role: "admin",
      name: "Admin Two",
    },
    {
      id: "VEN001",
      password: "123456",
      role: "vendor",
      name: "Vendor One",
    },
    {
      id: "VEN002",
      password: "123456",
      role: "vendor",
      name: "Vendor Two",
    },
    {
      id: "USR001",
      password: "123456",
      role: "user",
      name: "User One",
    },
    {
      id: "USR002",
      password: "123456",
      role: "user",
      name: "User Two",
    },
  ];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUser = users.find(
        (u) => u.id === userId && u.password === password
      );

      if (foundUser) {
        resolve(foundUser);
      } else {
        reject("Invalid User ID or Password");
      }
    }, 1000);
  });
};