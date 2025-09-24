import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export const studentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  parentName: z.string().min(2, 'Nome do responsável deve ter pelo menos 2 caracteres'),
  parentPhone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  parentEmail: z.string().email('Email inválido'),
  address: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
  medicalInfo: z.string().optional(),
  allergies: z.string().optional(),
  emergencyContact: z.string().min(2, 'Nome do contato de emergência é obrigatório'),
  emergencyPhone: z.string().min(10, 'Telefone de emergência deve ter pelo menos 10 dígitos'),
  enrollmentDate: z.string().min(1, 'Data de matrícula é obrigatória'),
  status: z.enum(['active', 'inactive']),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentFormData = z.infer<typeof studentSchema>;
