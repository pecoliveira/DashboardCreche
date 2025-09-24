import { Student } from '@/types';
import * as Papa from 'papaparse';

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export function exportToCSV(students: Student[], filename: string = 'alunos') {
  const csvData = students.map(student => ({
    'Nome': student.name,
    'Idade': student.age,
    'Data de Nascimento': formatDate(student.birthDate),
    'Nome do Responsável': student.parentName,
    'Telefone do Responsável': formatPhone(student.parentPhone),
    'Email do Responsável': student.parentEmail,
    'Endereço': student.address,
    'Informações Médicas': student.medicalInfo || '',
    'Alergias': student.allergies?.join(', ') || '',
    'Contato de Emergência': student.emergencyContact,
    'Telefone de Emergência': formatPhone(student.emergencyPhone),
    'Data de Matrícula': formatDate(student.enrollmentDate),
    'Status': student.status === 'active' ? 'Ativo' : 'Inativo',
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
