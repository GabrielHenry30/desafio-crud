import { CustomerRepository } from './customer.repository';
import { CreateUpdateCustomerDto } from './dto/create-update-customer.dto';
import { AbstractValidator } from '@/common/abstract.validator';
import { ConflictError } from '@/common/http.errors';

export class CustomerValidator extends AbstractValidator {
  readonly customerRepository: CustomerRepository;

  constructor() {
    super();
    this.customerRepository = new CustomerRepository();
  }

  async validateCustomerExists(customerData: CreateUpdateCustomerDto, id?: number) {
    const customer = await this.customerRepository.getByDocument(customerData.document);
    if (customer && customer.id !== Number(id)) {
      throw new ConflictError('Customer already exists with this document');
    }
  }
}
