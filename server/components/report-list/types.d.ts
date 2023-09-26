import { NextFunction, Request, Response } from 'express'
import { FieldDefinition } from '../../types/reports'
import Dict = NodeJS.Dict
import { ReportQuery } from '../../types/reports/class'

export interface ListDataSources {
  data: Promise<Dict<string>[]>
  count: Promise<number>
}

export interface RenderListInput {
  title: string
  fields: FieldDefinition[]
  request: Request
  response: Response
  next: NextFunction
  getListDataSources: (reportQuery: ReportQuery) => ListDataSources
  otherOptions?: Dict<object>
  layoutTemplate: string
}
