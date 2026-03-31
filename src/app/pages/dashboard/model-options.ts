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
    id: 'broiler-chicken-model',
    code: "broiler_chicken",
    name: 'Broiler Chicken Model',
    icon: 'pi pi-fw pi-shopping-bag',
    description: 'Input assumptions, forecasts, and dashboards for Broiler Chicken.',
    route: 'broiler-chicken-input-landing',
    isAvailable: false,
  },
];

 /* export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'pharma-model',
    code: "pharma",
    name: 'Pharmaceutical Model',
    description: 'Input assumptions, forecasts, and dashboards for pharma.',
    route: '/dashboard/pharma-input-landing',
  },
  {
    id: 'biotech-model',
    code: "biotech",
    name: 'Biotech Model',
    description: 'Input assumptions, forecasts, and dashboards for biotech.',
    route: '/dashboard/biotech-input-landing',
  },
  // {
  //   id: 'microbrewery-model',
  //   code: "microbrewery",
  //   name: 'Microbrewery Model',
  //   description: 'Input assumptions, forecasts, and dashboards for Microbrewerys.',
  //   route: '/dashboard/microbrewery-input-landing',
  // },
  // {
  //   id: 'goat-farming-model',
  //   code: "goat_farming",
  //   name: 'Goat Farming Model',
  //   description: 'Input assumptions, forecasts, and dashboards for Goat Farming.',
  //   route: '/dashboard/goat-farming-input-landing',
  // },
  // {
  //   id: 'cassava-ethanol-model',
  //   code: "cassava_ethanol",
  //   name: 'Cassava Ethanol Model',
  //   description: 'Input assumptions, forecasts, and dashboards for Cassava Ethanol.',
  //   route: '/dashboard/cassava-ethanol-input-landing',
  // },
  // {
  //   id: 'broiler-chicken-model',
  //   code: "broiler_chicken",
  //   name: 'Broiler Chicken Model',
  //   description: 'Input assumptions, forecasts, and dashboards for Broiler Chicken.',
  //   route: '/dashboard/broiler-chicken-input-landing',
  // },
]; */


