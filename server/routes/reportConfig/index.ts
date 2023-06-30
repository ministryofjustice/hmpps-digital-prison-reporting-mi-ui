import externalMovements from './externalMovements'
import Dict = NodeJS.Dict
import type { ReportConfig } from '../../types/reports'

const reportConfigs: Dict<ReportConfig> = {
  'external-movements': externalMovements,
}

export default reportConfigs
