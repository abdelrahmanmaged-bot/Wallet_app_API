import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Type from 'Contracts/Enums/type'
import IncomeCategory from 'Contracts/Enums/IncomeCategory'
import User from './User'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: number

  @column()
  public type: Type  

  
  @column()
  public incomeCategory?: IncomeCategory

  
  @column()
  public userId: number


  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(()=>User,{
    localKey: 'id',
    foreignKey: "userId"
  })
  public user: BelongsTo<typeof User>
}
