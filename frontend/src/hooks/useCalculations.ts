import { TAX_CONSTANTS } from '../utils/constants'

export function useCalculations() {
  function calculateMonthlyCost(
    powerW: number,
    hoursPerDay: number,
    pvpcEuroPerKwh: number,
    bonusRate: number = 1.0
  ) {
    const energyKwh = (powerW * hoursPerDay * 30) / 1000
    const baseCost = energyKwh * pvpcEuroPerKwh
    const withIEE = baseCost * (1 + TAX_CONSTANTS.IEE_RATE)
    const withTaxes = withIEE * (1 + TAX_CONSTANTS.IVA_RATE) * bonusRate

    return { energyKwh, baseCost, withTaxes }
  }

  return { calculateMonthlyCost }
}
