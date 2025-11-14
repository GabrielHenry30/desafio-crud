import { JsonController, Get, Post, Put, Delete, Param, Body, Req } from 'routing-controllers';
import { Request } from 'express';
import { CustomerService } from './customer.service';
import { CreateUpdateCustomerDto } from './dto/create-update-customer.dto';
import { plainToInstance } from 'class-transformer';
import { GetCustomersQueryDto } from './dto/get-customers-query.dto';

@JsonController('/customer')
export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  @Get()
  async getAll(@Req() request: Request) {
    return await this.customerService.getAll(plainToInstance(GetCustomersQueryDto, request.query));
  }

  @Get('/:id')
  async getById(@Param('id') id: number) {
    return await this.customerService.getById(id);
  }

  @Post()
  async create(@Body() customerData: CreateUpdateCustomerDto) {
    return await this.customerService.create(customerData);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() customerData: CreateUpdateCustomerDto) {
    return await this.customerService.update(id, customerData);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.customerService.delete(id);
  }
}
