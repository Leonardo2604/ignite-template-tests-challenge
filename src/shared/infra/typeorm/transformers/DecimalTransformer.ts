import { ValueTransformer } from 'typeorm';

export class DecimalTransformer implements ValueTransformer {

  to(decimal?: number): string {
    return String(decimal);
  }


  from(decimal?: string): number | null {
    return decimal ? Number(decimal) : null;
  }
}
