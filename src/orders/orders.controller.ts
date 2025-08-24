import { Controller, Get, Post, Body, Param, Inject, Query, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';


@Controller('orders')
export class OrdersController {

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder',createOrderDto)
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
   try {
    const orders = await firstValueFrom(this.client.send('findAllOrders',orderPaginationDto));
    return orders;
   } catch (error) {
    throw new RpcException(error);
   }
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder',{id})
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return  this.client.send('findAllOrders',
      {
        ...paginationDto,
        status: statusDto.status
      }
    )
    .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
    )
  }


  @Patch(':id')
    changeStatus(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() statusDto: StatusDto
    ){

     return this.client.send('changeOrderStatus',{
      id,
      status: statusDto.status
     })
     .pipe(
      catchError(err => {
        throw new RpcException(err)
      })
     )
    }
}
