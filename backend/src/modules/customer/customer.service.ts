import { CustomerRepository } from './customer.repository';
import { CreateUpdateCustomerDto } from './dto/create-update-customer.dto';
import { GetCustomersQueryDto } from './dto/get-customers-query.dto';
import { CustomerValidator } from './customer.validator';
import { Customer } from '@prisma/client';

export class CustomerService {
  private customerRepository: CustomerRepository;
  private customerValidator: CustomerValidator;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.customerValidator = new CustomerValidator();
  }

  async getAll(queryParams: GetCustomersQueryDto): Promise<{
    data: Customer[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  }> {
    return await this.customerRepository.findAll(queryParams);
  }

  async getById(id: number): Promise<Customer> {
    return await this.customerRepository.findById(id);
  }

  async create(customerData: CreateUpdateCustomerDto): Promise<Customer> {
    await this.customerValidator.validatePayload(customerData, CreateUpdateCustomerDto);
    await this.customerValidator.validateCustomerExists(customerData);
    return this.customerRepository.create(customerData);
  }

  async update(id: number, customerData: CreateUpdateCustomerDto): Promise<Customer> {
    await this.customerValidator.validatePayload(customerData, CreateUpdateCustomerDto);
    await this.customerValidator.validateCustomerExists(customerData, id);
    return await this.customerRepository.update(id, customerData);
  }

  async delete(id: number): Promise<{ message: string; }> {
    await this.customerRepository.softDelete(id);
    return { message: 'Customer deleted successfully' };
  }
}
