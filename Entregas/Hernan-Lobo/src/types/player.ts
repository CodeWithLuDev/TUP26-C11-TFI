export interface Player {
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Forward';
  jerseyNum: number;
  age: number;
  height: number;
  weight: number;
  picture: string;
  country: string;
  birthDate: string;
}
