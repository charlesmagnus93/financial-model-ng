export interface ModelOption {
  id: string;
  code: string;
  name: string;
  icon: string;
  description: string;
  route: string;
  isAvailable: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'pharma-model',
    code: "pharma",
    name: 'Pharmaceutical Model',
    icon: 'pi pi-fw pi-heart-fill',
    description: 'Input assumptions, forecasts, and dashboards for pharma.',
    route: 'pharma-input-landing',
    isAvailable: true,
  },
  {
    id: 'biotech-model',
    code: "biotech",
    name: 'Biotech Model',
    icon: 'pi pi-fw pi-microchip',
    description: 'Input assumptions, forecasts, and dashboards for biotech.',
    route: 'biotech-input-landing',
    isAvailable: true,
  },
  {
    id: 'microbrewery-model',
    code: "microbrewery",
    name: 'Microbrewery Model',
    icon: 'pi pi-fw pi-building',
    description: 'Input assumptions, forecasts, and dashboards for Microbrewerys.',
    route: 'microbrewery-input-landing',
    isAvailable: false,
  },
  {
    id: 'goat-farming-model',
    code: "goat_farming",
    name: 'Goat Farming Model',
    icon: 'pi pi-fw pi-home',
    description: 'Input assumptions, forecasts, and dashboards for Goat Farming.',
    route: 'goat-farming-input-landing',
    isAvailable: false,
  },
  {
    id: 'cassava-ethanol-model',
    code: "cassava_ethanol",
    name: 'Cassava Ethanol Model',
    icon: 'pi pi-fw pi-bolt',
    description: 'Input assumptions, forecasts, and dashboards for Cassava Ethanol.',
    route: 'cassava-ethanol-input-landing',
    isAvailable: true,
  },
  {
    id: 'chicken-farming-model',
    code: "chicken_farming",
    name: 'Chicken farming Model',
    icon: 'pi pi-fw pi-warehouse',
    description: 'Input assumptions, forecasts, and dashboards for Chicken farming.',
    route: 'chicken-farming-input-landing',
    isAvailable: false,
  },
  {
    id: 'solar-farm-model',
    code: "solar_farm",
    name: 'Solar farm Model',
    icon: 'pi pi-fw pi-sun',
    description: 'Input assumptions, forecasts, and dashboards for Solar farm.',
    route: 'solar-farm-input-landing',
    isAvailable: false,
  },
];
