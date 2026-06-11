export type GroupLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export interface Team {
  id: string;
  name: string;
  flag: string;
  group: GroupLetter;
}
