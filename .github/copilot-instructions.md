# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
Este é um dashboard para cadastro de alunos de uma creche, construído com:
- **Next.js** com TypeScript
- **Tailwind CSS** para estilização
- **Firebase** para autenticação e banco de dados
- **React Hook Form** com Zod para validação de formulários

## Funcionalidades Principais
1. Sistema de login para professores e colaboradores
2. Cadastro completo de alunos
3. Listagem de alunos com filtros avançados
4. Exportação de relatórios em CSV
5. Interface responsiva e moderna

## Padrões de Código
- Use TypeScript em todos os componentes
- Prefira componentes funcionais com hooks
- Use Tailwind CSS para estilização
- Implemente validação de formulários com Zod
- Mantenha componentes reutilizáveis na pasta `components`
- Use Firebase Auth para autenticação
- Use Firestore para banco de dados

## Estrutura de Dados
### Usuário (Professor/Colaborador)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'professor' | 'colaborador';
  createdAt: Date;
}
```

### Aluno
```typescript
interface Student {
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
```
