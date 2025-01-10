import { DollarSign, Wallet, Percent, Sparkles } from 'lucide-react';

export const searchSections = {
  carDetails: {
    title: 'search.sections.carDetails',
    filters: {
      make: {
        title: 'search.filters.make',
        type: 'select',
        options: ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Lexus', 'Hyundai'],
      },
      model: {
        title: 'search.filters.model',
        type: 'select',
        options: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
      },
      year: {
        title: 'search.filters.year',
        type: 'select',
        options: Array.from({ length: 2024 - 1990 }, (_, i) => (2024 - i).toString())
      },
      trim: {
        title: 'search.filters.trim',
        type: 'select',
        options: ['LE', 'XLE', 'SE', 'XSE', 'Limited']
      }
    }
  },
  specifications: {
    title: 'search.sections.specifications',
    filters: {
      bodyType: {
        title: 'search.filters.bodyType',
        type: 'multi',
        options: [
          { id: 'sedan', label: 'search.bodyTypes.sedan' },
          { id: 'suv', label: 'search.bodyTypes.suv' },
          { id: 'coupe', label: 'search.bodyTypes.coupe' },
          { id: 'truck', label: 'search.bodyTypes.truck' },
          { id: 'van', label: 'search.bodyTypes.van' }
        ]
      },
      transmission: {
        title: 'search.filters.transmission',
        type: 'multi',
        options: [
          { id: 'automatic', label: 'search.transmission.automatic' },
          { id: 'manual', label: 'search.transmission.manual' }
        ]
      },
      fuelType: {
        title: 'search.filters.fuelType',
        type: 'multi',
        options: [
          { id: 'petrol', label: 'search.fuelTypes.petrol' },
          { id: 'diesel', label: 'search.fuelTypes.diesel' },
          { id: 'hybrid', label: 'search.fuelTypes.hybrid' },
          { id: 'electric', label: 'search.fuelTypes.electric' }
        ]
      }
    }
  },
  pricing: {
    title: 'search.sections.pricing',
    filters: {
      price: {
        title: 'search.filters.price',
        type: 'range',
        min: 0,
        max: 1000000,
        step: 5000
      },
      paymentType: {
        title: 'search.filters.paymentType',
        type: 'multi',
        options: [
          { id: 'cash', label: 'search.paymentTypes.cash', icon: DollarSign },
          { id: 'finance', label: 'search.paymentTypes.finance', icon: Wallet }
        ]
      },
      discount: {
        title: 'search.filters.discount',
        type: 'multi',
        options: [
          { id: 'cashDiscount', label: 'search.discounts.cash', icon: Percent },
          { id: 'specialOffer', label: 'search.discounts.special', icon: Sparkles }
        ]
      }
    }
  }
};