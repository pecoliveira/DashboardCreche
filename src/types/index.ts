export interface User {
  id: string;
  email: string;
  name: string;
  role: 'professor' | 'colaborador';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  birthDate: Date;
  age: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  medicalInfo?: string;
  allergies?: string[];
  emergencyContact: string;
  emergencyPhone: string;
  enrollmentDate: Date;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentFormData {
  name: string;
  birthDate: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  medicalInfo?: string;
  allergies?: string;
  emergencyContact: string;
  emergencyPhone: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

export interface LoginFormData {
  email: string;
  password: string;
}
