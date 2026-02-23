export interface SubTest {
  name: string;
  unit: string;
  range: string;
  method: string;
  sample: string;
  price: number;
  description: string;
  enabled: boolean;
}

export interface Test {
  id: number;
  name: string;
  category: string;
  enabled: boolean;
  subTests: SubTest[];
}