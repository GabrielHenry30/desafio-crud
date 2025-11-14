export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED';

export interface Customer {
  id: number;
  name: string;
  email: string;
  document: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GetCustomersResponse {
  data: Customer[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GetCustomersQuery {
  page?: number;
  size?: number;
  name?: string;
  email?: string;
  document?: string;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  document: string;
  status?: CustomerStatus;
}

