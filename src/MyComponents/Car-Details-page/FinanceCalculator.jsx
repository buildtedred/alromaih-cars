import React, { useState, useMemo } from "react"

export const FinanceCalculator = ({ carPrice }) => {
  const [downPayment, setDownPayment] = useState(carPrice * 0.2)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(3.5)

  const calculateMonthlyPayment = useMemo(() => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numberOfPayments = loanTerm

    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    ).toFixed(2)
  }, [carPrice, downPayment, loanTerm, interestRate])

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
          الدفعة الأولى
        </label>
        <input
          type="number"
          id="downPayment"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <div>
        <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
          مدة القرض (بالأشهر)
        </label>
        <input
          type="number"
          id="loanTerm"
          value={loanTerm}
          onChange={(e) => setLoanTerm(Number(e.target.value))}
          className="w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <div>
        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
          معدل الفائدة السنوي (%)
        </label>
        <input
          type="number"
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="w-full px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="text-base sm:text-lg font-semibold mb-2 text-brand-primary">القسط الشهري المقدر</h4>
        <p className="text-2xl sm:text-3xl font-bold">{calculateMonthlyPayment} ريال</p>
      </div>
    </div>
  )
}

