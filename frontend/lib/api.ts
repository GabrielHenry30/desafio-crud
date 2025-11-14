import { GetCustomersResponse, GetCustomersQuery, CreateCustomerDto, Customer } from '@/types/customer';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const api = {
  async getCustomers(query: GetCustomersQuery = {}): Promise<GetCustomersResponse> {
    const params = new URLSearchParams();
    
    if (query.page) params.append('page', query.page.toString());
    if (query.size) params.append('size', query.size.toString());
    if (query.name) params.append('name', query.name);
    if (query.email) params.append('email', query.email);
    if (query.document) params.append('document', query.document);

    const url = `${API_BASE_URL}/customer${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch customers');
    }

    return response.json();
  },

  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create customer' }));
      throw new Error(error.message || 'Failed to create customer');
    }

    return response.json();
  },

  async updateCustomer(id: number, data: CreateCustomerDto): Promise<Customer> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update customer' }));
      throw new Error(error.message || 'Failed to update customer');
    }

    return response.json();
  },

  async deleteCustomer(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/customer/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete customer');
    }
  },
};

