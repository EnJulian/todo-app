export interface UserModel {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  salt: string;
  created_at: Date;
  updated_at: Date;
}
