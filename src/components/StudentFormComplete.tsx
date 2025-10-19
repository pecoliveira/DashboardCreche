'use client';

import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Save, UserPlus, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { calculateAge } from '@/lib/utils';

export default function StudentFormComplete() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para controlar seções expandidas
  const [expandedSections, setExpandedSections] = useState({
    studentInfo: true,
    healthInfo: false,
    responsibleInfo: false,
    birthCertificate: false,
    housingConditions: false,
    householdItems: false,
    familyComposition: false,
    authorizedPersons: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    
    try {
      const [birthYear, birthMonth, birthDay] = (formData.get('birthDate') as string).split('-').map(Number);
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay, 12, 0, 0);
      
      const [enrollYear, enrollMonth, enrollDay] = (formData.get('enrollmentDate') as string).split('-').map(Number);
      const enrollmentDate = new Date(enrollYear, enrollMonth - 1, enrollDay, 12, 0, 0);
      
      const age = calculateAge(birthDate);

      const studentData = {
        // Dados do Aluno
        name: formData.get('name') as string,
        identidade: formData.get('identidade') as string,
        birthDate: Timestamp.fromDate(birthDate),
        age,
        sexo: formData.get('sexo') as string,
        corRaca: formData.get('corRaca') as string,
        gemeo: formData.get('gemeo') === 'true',
        
        // Saúde
        cadastroSUS: formData.get('cadastroSUS') as string,
        unidadeSaude: formData.get('unidadeSaude') as string,
        problemasSaude: formData.get('problemasSaude') as string || '',
        restricaoAlimentar: formData.get('restricaoAlimentar') as string || '',
        allergies: (formData.get('allergies') as string)?.split(',').map(a => a.trim()) || [],
        mobilidadeReduzida: formData.get('mobilidadeReduzida') === 'true',
        deficienciaMultipla: formData.get('deficienciaMultipla') === 'true',
        publicoEducacaoEspecial: formData.get('publicoEducacaoEspecial') === 'true',
        
        // Responsável 1
        responsavel1: {
          nome: formData.get('resp1Nome') as string,
          cpf: formData.get('resp1CPF') as string,
          rg: formData.get('resp1RG') as string,
          contato: formData.get('resp1Contato') as string,
          localTrabalho: formData.get('resp1LocalTrabalho') as string,
        },
        
        // Responsável 2 (opcional)
        responsavel2: {
          nome: formData.get('resp2Nome') as string || '',
          cpf: formData.get('resp2CPF') as string || '',
          rg: formData.get('resp2RG') as string || '',
          contato: formData.get('resp2Contato') as string || '',
          localTrabalho: formData.get('resp2LocalTrabalho') as string || '',
        },
        
        // Benefícios
        beneficiarioAuxilio: formData.get('beneficiarioAuxilio') === 'true',
        tipoAuxilio: formData.get('tipoAuxilio') as string || '',
        nis: formData.get('nis') as string || '',
        
        // Endereço
        endereco: {
          logradouro: formData.get('enderecoLogradouro') as string,
          numero: formData.get('enderecoNumero') as string,
          complemento: formData.get('enderecoComplemento') as string || '',
          bairro: formData.get('enderecoBairro') as string,
          cidade: formData.get('enderecoCidade') as string,
          estado: formData.get('enderecoEstado') as string,
          cep: formData.get('enderecoCEP') as string,
          referencia: formData.get('enderecoReferencia') as string,
          telefoneResidencial: formData.get('telefoneResidencial') as string || '',
        },
        
        // Certidão de Nascimento
        certidaoNascimento: {
          matricula: formData.get('certidaoMatricula') as string,
          municipio: formData.get('certidaoMunicipio') as string,
          cartorio: formData.get('certidaoCartorio') as string,
          cpf: formData.get('certidaoCPF') as string || '',
          rg: formData.get('certidaoRG') as string || '',
          dataEmissao: formData.get('certidaoDataEmissao') as string,
          orgaoEmissor: formData.get('certidaoOrgaoEmissor') as string,
        },
        
        // Condições Habitacionais
        condicoesHabitacionais: {
          tipoMoradia: formData.get('tipoMoradia') as string,
          quantidadeComodos: parseInt(formData.get('quantidadeComodos') as string),
          tipoPiso: formData.get('tipoPiso') as string,
          tipoSaneamento: formData.get('tipoSaneamento') as string,
        },
        
        // Itens do Domicílio
        itensDomicilio: {
          tv: formData.get('itemTV') === 'true',
          dvd: formData.get('itemDVD') === 'true',
          radio: formData.get('itemRadio') === 'true',
          computador: formData.get('itemComputador') === 'true',
          notebook: formData.get('itemNotebook') === 'true',
          telefoneFixo: formData.get('itemTelefoneFixo') === 'true',
          telefoneCelular: formData.get('itemTelefoneCelular') === 'true',
          tablet: formData.get('itemTablet') === 'true',
          internet: formData.get('itemInternet') === 'true',
          tvAssinatura: formData.get('itemTVAssinatura') === 'true',
          fogao: formData.get('itemFogao') === 'true',
          geladeira: formData.get('itemGeladeira') === 'true',
          freezer: formData.get('itemFreezer') === 'true',
          microondas: formData.get('itemMicroondas') === 'true',
          maquinaLavar: formData.get('itemMaquinaLavar') === 'true',
          arCondicionado: formData.get('itemArCondicionado') === 'true',
          bicicleta: formData.get('itemBicicleta') === 'true',
          moto: formData.get('itemMoto') === 'true',
          automovel: formData.get('itemAutomovel') === 'true',
        },
        
        // Composição Familiar (texto simples)
        composicaoFamiliar: formData.get('composicaoFamiliar') as string,
        
        // Renda
        rendaFamiliarTotal: parseFloat(formData.get('rendaFamiliarTotal') as string),
        rendaPerCapita: parseFloat(formData.get('rendaPerCapita') as string),
        
        // Educação
        serieACursar: formData.get('serieACursar') as string,
        anoLetivo: formData.get('anoLetivo') as string,
        
        // Pessoas Autorizadas (texto simples)
        pessoasAutorizadas: formData.get('pessoasAutorizadas') as string,
        
        // Datas
        enrollmentDate: Timestamp.fromDate(enrollmentDate),
        
        // Status
        status: formData.get('status') as 'active' | 'inactive',
        
        // Metadados
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await addDoc(collection(db, 'students'), studentData);
      
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Erro ao cadastrar aluno. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const SectionHeader = ({ 
    title, 
    section, 
    expanded 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    expanded: boolean;
  }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <UserPlus className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Ficha de Matrícula Completa</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-sm text-green-600">✓ Aluno cadastrado com sucesso!</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* SEÇÃO 1: DADOS DO ALUNO */}
          <div className="space-y-4">
            <SectionHeader 
              title="1. Dados do Aluno" 
              section="studentInfo" 
              expanded={expandedSections.studentInfo} 
            />
            
            {expandedSections.studentInfo && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Identidade *</label>
                    <input
                      name="identidade"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Nascimento *</label>
                    <input
                      name="birthDate"
                      type="date"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Sexo *</label>
                    <select
                      name="sexo"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cor/Raça *</label>
                    <select
                      name="corRaca"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione</option>
                      <option value="Branca">Branca</option>
                      <option value="Preta">Preta</option>
                      <option value="Parda">Parda</option>
                      <option value="Amarela">Amarela</option>
                      <option value="Indígena">Indígena</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gêmeo? *</label>
                    <select
                      name="gemeo"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 2: INFORMAÇÕES DE SAÚDE */}
          <div className="space-y-4">
            <SectionHeader 
              title="2. Informações de Saúde" 
              section="healthInfo" 
              expanded={expandedSections.healthInfo} 
            />
            
            {expandedSections.healthInfo && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cadastro SUS *</label>
                    <input
                      name="cadastroSUS"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Número do Cartão SUS"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Unidade de Saúde *</label>
                    <input
                      name="unidadeSaude"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="UBS de referência"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Problemas de Saúde</label>
                    <textarea
                      name="problemasSaude"
                      rows={2}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Descreva problemas de saúde (se houver)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Restrição Alimentar</label>
                    <input
                      name="restricaoAlimentar"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Lactose, Glúten"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alergias</label>
                    <input
                      name="allergies"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Separe por vírgulas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mobilidade Reduzida? *</label>
                    <select
                      name="mobilidadeReduzida"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deficiência Múltipla? *</label>
                    <select
                      name="deficienciaMultipla"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Público Alvo Educação Especial? *</label>
                    <select
                      name="publicoEducacaoEspecial"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 3: DADOS DOS RESPONSÁVEIS */}
          <div className="space-y-4">
            <SectionHeader 
              title="3. Dados dos Responsáveis" 
              section="responsibleInfo" 
              expanded={expandedSections.responsibleInfo} 
            />
            
            {expandedSections.responsibleInfo && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-6">
                {/* Responsável 1 */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Responsável 1</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Nome Completo *</label>
                      <input
                        name="resp1Nome"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">CPF *</label>
                      <input
                        name="resp1CPF"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">RG *</label>
                      <input
                        name="resp1RG"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contato *</label>
                      <input
                        name="resp1Contato"
                        type="tel"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Local de Trabalho *</label>
                      <input
                        name="resp1LocalTrabalho"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Responsável 2 (Opcional) */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Responsável 2 (Opcional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                      <input
                        name="resp2Nome"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">CPF</label>
                      <input
                        name="resp2CPF"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">RG</label>
                      <input
                        name="resp2RG"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contato</label>
                      <input
                        name="resp2Contato"
                        type="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Local de Trabalho</label>
                      <input
                        name="resp2LocalTrabalho"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-900">Benefícios Governamentais</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Recebe Auxílio? *</label>
                      <select
                        name="beneficiarioAuxilio"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo de Auxílio</label>
                      <input
                        name="tipoAuxilio"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Ex: Bolsa Família"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">NIS</label>
                      <input
                        name="nis"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Endereço */}
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-900">Endereço Completo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Logradouro *</label>
                      <input
                        name="enderecoLogradouro"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Rua, Avenida, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Número *</label>
                      <input
                        name="enderecoNumero"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Complemento</label>
                      <input
                        name="enderecoComplemento"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bairro *</label>
                      <input
                        name="enderecoBairro"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cidade *</label>
                      <input
                        name="enderecoCidade"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estado *</label>
                      <select
                        name="enderecoEstado"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Selecione</option>
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">CEP *</label>
                      <input
                        name="enderecoCEP"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Referência *</label>
                      <input
                        name="enderecoReferencia"
                        type="text"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Próximo a..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefone Residencial</label>
                      <input
                        name="telefoneResidencial"
                        type="tel"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 4: CERTIDÃO DE NASCIMENTO */}
          <div className="space-y-4">
            <SectionHeader 
              title="4. Certidão de Nascimento" 
              section="birthCertificate" 
              expanded={expandedSections.birthCertificate} 
            />
            
            {expandedSections.birthCertificate && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Matrícula *</label>
                    <input
                      name="certidaoMatricula"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Município *</label>
                    <input
                      name="certidaoMunicipio"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cartório *</label>
                    <input
                      name="certidaoCartorio"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">CPF</label>
                    <input
                      name="certidaoCPF"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">RG</label>
                    <input
                      name="certidaoRG"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Emissão *</label>
                    <input
                      name="certidaoDataEmissao"
                      type="date"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Órgão Emissor *</label>
                    <input
                      name="certidaoOrgaoEmissor"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 5: CONDIÇÕES HABITACIONAIS */}
          <div className="space-y-4">
            <SectionHeader 
              title="5. Condições Habitacionais e Sanitárias" 
              section="housingConditions" 
              expanded={expandedSections.housingConditions} 
            />
            
            {expandedSections.housingConditions && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Moradia *</label>
                    <select
                      name="tipoMoradia"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione</option>
                      <option value="Própria">Casa Própria</option>
                      <option value="Cedida">Cedida</option>
                      <option value="Alugada">Alugada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantidade de Cômodos *</label>
                    <input
                      name="quantidadeComodos"
                      type="number"
                      required
                      min="1"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Piso *</label>
                    <select
                      name="tipoPiso"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione</option>
                      <option value="Cerâmica">Cerâmica</option>
                      <option value="Cimento">Cimento</option>
                      <option value="Terra">Terra</option>
                      <option value="Madeira">Madeira</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo de Saneamento *</label>
                    <select
                      name="tipoSaneamento"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Selecione</option>
                      <option value="Rede Pública">Rede Pública</option>
                      <option value="Fossa Séptica">Fossa Séptica</option>
                      <option value="Fossa Rudimentar">Fossa Rudimentar</option>
                      <option value="Sem Saneamento">Sem Saneamento</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 6: ITENS DO DOMICÍLIO */}
          <div className="space-y-4">
            <SectionHeader 
              title="6. Itens Presentes no Domicílio" 
              section="householdItems" 
              expanded={expandedSections.householdItems} 
            />
            
            {expandedSections.householdItems && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {[
                    { name: 'itemTV', label: 'TV' },
                    { name: 'itemDVD', label: 'DVD' },
                    { name: 'itemRadio', label: 'Rádio' },
                    { name: 'itemComputador', label: 'Computador' },
                    { name: 'itemNotebook', label: 'Notebook' },
                    { name: 'itemTelefoneFixo', label: 'Telefone Fixo' },
                    { name: 'itemTelefoneCelular', label: 'Celular' },
                    { name: 'itemTablet', label: 'Tablet' },
                    { name: 'itemInternet', label: 'Internet' },
                    { name: 'itemTVAssinatura', label: 'TV Assinatura' },
                    { name: 'itemFogao', label: 'Fogão' },
                    { name: 'itemGeladeira', label: 'Geladeira' },
                    { name: 'itemFreezer', label: 'Freezer' },
                    { name: 'itemMicroondas', label: 'Micro-ondas' },
                    { name: 'itemMaquinaLavar', label: 'Máquina Lavar' },
                    { name: 'itemArCondicionado', label: 'Ar-Condicionado' },
                    { name: 'itemBicicleta', label: 'Bicicleta' },
                    { name: 'itemMoto', label: 'Moto' },
                    { name: 'itemAutomovel', label: 'Automóvel' },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center">
                      <input
                        type="checkbox"
                        name={item.name}
                        value="true"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 7: COMPOSIÇÃO FAMILIAR E RENDA */}
          <div className="space-y-4">
            <SectionHeader 
              title="7. Composição Familiar e Renda" 
              section="familyComposition" 
              expanded={expandedSections.familyComposition} 
            />
            
            {expandedSections.familyComposition && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Composição Familiar *</label>
                  <textarea
                    name="composicaoFamiliar"
                    rows={6}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva todos os membros da família que moram na mesma casa, incluindo nome, idade, situação escolar, situação de emprego e renda de cada um."
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Exemplo: João Silva, 35 anos, Ensino Médio Completo, Comerciante, R$ 2.000,00
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Renda Familiar Total (R$) *</label>
                    <input
                      name="rendaFamiliarTotal"
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Renda Per Capita (R$) *</label>
                    <input
                      name="rendaPerCapita"
                      type="number"
                      step="0.01"
                      required
                      min="0"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SEÇÃO 8: INFORMAÇÕES ESCOLARES E AUTORIZAÇÕES */}
          <div className="space-y-4">
            <SectionHeader 
              title="8. Informações Escolares e Pessoas Autorizadas" 
              section="authorizedPersons" 
              expanded={expandedSections.authorizedPersons} 
            />
            
            {expandedSections.authorizedPersons && (
              <div className="p-4 border border-gray-200 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Série a Cursar *</label>
                    <input
                      name="serieACursar"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Creche II"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ano Letivo *</label>
                    <input
                      name="anoLetivo"
                      type="text"
                      required
                      defaultValue="2025"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Instruções:</strong> Liste todas as pessoas autorizadas a retirar a criança, incluindo nome, parentesco, RG e telefone de cada uma.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Pessoas Autorizadas a Retirar a Criança *</label>
                  <textarea
                    name="pessoasAutorizadas"
                    rows={6}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Exemplo:&#10;Maria Silva - Avó - RG: 12.345.678-9 - Tel: (11) 98888-8888&#10;José Santos - Tio - RG: 98.765.432-1 - Tel: (11) 97777-7777"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Data de Matrícula *</label>
                    <input
                      name="enrollmentDate"
                      type="date"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status *</label>
                    <select
                      name="status"
                      required
                      defaultValue="active"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 text-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={() => (document.querySelector('form') as HTMLFormElement)?.reset()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Limpar Formulário
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Cadastrar Aluno
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
