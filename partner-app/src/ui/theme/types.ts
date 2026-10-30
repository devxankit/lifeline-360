export type ServiceKey =
  | 'doctor'
  | 'medicine'
  | 'nursing'
  | 'ambulance'
  | 'lab'
  | 'blood'
  | 'membership'
  | 'als'
  | 'bls'
  | 'icu';

export type ServiceInfo = {
  bg: string;
  fg: string;
  text: string;
  label: string;
};

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
