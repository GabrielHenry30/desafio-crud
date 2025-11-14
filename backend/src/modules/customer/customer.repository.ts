import { NotFoundError } from 'routing-controllers';
import { prisma } from '@/database/prisma.client';
import { CreateUpdateCustomerDto } from './dto/create-update-customer.dto';
import { GetCustomersQueryDto } from './dto/get-customers-query.dto';
import { Customer } from '@prisma/client';

export class CustomerRepository {
  async findAll(queryParams: GetCustomersQueryDto):
    Promise<{
      data: Customer[];
      total: number;
      page: number;
      size: number;
      totalPages: number;
    }> {
    const { page = 1, size = 10, name, email, document } = queryParams;
    const pageNum = Number(page) || 1;
    const sizeNum = Number(size) || 10;
    const skip = (pageNum - 1) * sizeNum;
    const filters = {
      ...(name && { name: { contains: name } }),
      ...(email && { email: { contains: email } }),
      ...(document && { document: { contains: document.replace(/\D/g, '') } }),
    };

    const data = await prisma.customer.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: sizeNum,
    });
    const total = await prisma.customer.count({ where: filters });

    return {
      data,
      total,
      page: pageNum,
      size: sizeNum,
      totalPages: Math.max(1, Math.ceil(total / sizeNum)),
    };
  }

  async findById(id: number): Promise<Customer> {
    const customer = await prisma.customer.findFirst({
      where: {
        id: Number(id),
      },
    });

    if (!customer) {
      console.error(`Customer not found with id: ${id}`);
      throw new NotFoundError('Customer not found');
    }

    return customer;
  }

  async getByDocument(document: string): Promise<Customer> {
    const normalizedDocument = document.replace(/\D/g, '');

    return await prisma.customer.findFirst({
      where: {
        document: normalizedDocument,
      },
    });
  }

  async create(customerData: CreateUpdateCustomerDto): Promise<Customer> {
    return await prisma.customer.create({
      data: {
        name: customerData.name,
        email: customerData.email,
        document: customerData.document,
      },
    });
  }

  async update(id: number, customerData: CreateUpdateCustomerDto): Promise<Customer> {
    await this.findById(id);
    return await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        ...customerData,
      },
    });
  }

  async softDelete(id: number): Promise<boolean> {
    await this.findById(id);
    await prisma.customer.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}
