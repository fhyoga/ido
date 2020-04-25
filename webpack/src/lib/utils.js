import { es } from './es'
let { common, var1 } = require('./common')
export const mt1 = () => {
  es()
  common()
  var1 = 2
  return 'mt1'
}
export const mt2 = () => {
  return 'mt2'
}
