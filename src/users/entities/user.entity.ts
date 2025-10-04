export class User {
  id: number;
  email: string;
  name?: string;
  password: string;
  telephone?: string;
  role: string;
  tenantId?: number;
  createdAt: Date;
  updatedAt: Date;
}
