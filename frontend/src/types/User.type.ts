type User = {
  id: number;
  name: string;
  email: string;
  password?: string;
  admin: boolean;
  // created_at: string;
  // updated_at: string;
};

export default User;
