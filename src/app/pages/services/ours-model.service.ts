import { Injectable } from '@angular/core';
import { AVAILABLE_MODELS } from '../dashboard/model-options';

export interface OursModelMeta {
  code: string;
  name: string;
  description: string;
  templateName: string;
  instructions: string[];
  createRoute?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OursModelService {
  private readonly defaultInstructions = [
    'Download the template and fill in the required assumptions.',
    'Validate the inputs and make sure totals are consistent.',
    'Create the model to launch the input workflow.',
  ];

  private readonly models: OursModelMeta[] = [
    {
      code: 'pharma',
      name: 'Pharmaceuticals',
      description: 'Financial planning template for pharmaceutical products.',
      templateName: 'pharma-model-template.xlsx',
      instructions: this.defaultInstructions,
      createRoute: '/dashboard/pharma-input-landing',
    },
    {
      code: 'biotech',
      name: 'Biotech',
      description: 'Forecasting and valuation template for biotech portfolios.',
      templateName: 'biotech-model-template.xlsx',
      instructions: this.defaultInstructions,
      createRoute: '/dashboard/biotech-input-landing',
    },
    {
      code: 'microbrewery',
      name: 'Microbrewery',
      description: 'Revenue and cost model template for microbrewery operations.',
      templateName: 'microbrewery-model-template.xlsx',
      instructions: this.defaultInstructions,
    },
    {
      code: 'goat_farming',
      name: 'Goat Farming',
      description: 'Livestock unit economics and cash flow template.',
      templateName: 'goat-farming-model-template.xlsx',
      instructions: this.defaultInstructions,
    },
    {
      code: 'cassava_ethanol',
      name: 'Cassava Ethanol',
      description: 'Cassava ethanol production and margin model template.',
      templateName: 'cassava-ethanol-model-template.xlsx',
      instructions: this.defaultInstructions,
      createRoute: '/dashboard/cassava-ethanol-input-landing',
    },
    {
      code: 'broiler_chicken',
      name: 'Broiler Chicken',
      description: 'Broiler chicken farm planning template.',
      templateName: 'broiler-chicken-model-template.xlsx',
      instructions: this.defaultInstructions,
    },
  ];

  getModel(code: string): OursModelMeta | undefined {
    const fromList = this.models.find((item) => item.code === code);
    if (fromList) {
      return fromList;
    }
    const fromAvailable = AVAILABLE_MODELS.find((item) => item.code === code);
    if (!fromAvailable) {
      return undefined;
    }
    return {
      code: fromAvailable.code,
      name: fromAvailable.name,
      description: fromAvailable.description,
      templateName: `${fromAvailable.code}-model-template.xlsx`,
      instructions: this.defaultInstructions,
      createRoute: fromAvailable.route,
    };
  }
}
