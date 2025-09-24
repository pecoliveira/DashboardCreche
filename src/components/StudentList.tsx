'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Search, Filter, Users, Download, Edit2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Student } from '@/types';
import { formatDate, formatPhone, exportToCSV } from '@/lib/utils';

interface StudentListProps {
  onEditStudent?: (student: Student) => void;
}

export default function StudentList({ onEditStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    filterStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students, searchTerm, ageFilter, statusFilter]);

  const fetchStudents = async () => {
    try {
      const q = query(collection(db, 'students'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      
      const studentsData: Student[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        studentsData.push({
          id: doc.id,
          name: data.name,
          birthDate: data.birthDate.toDate(),
          age: data.age,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          parentEmail: data.parentEmail,
          address: data.address,
          medicalInfo: data.medicalInfo,
          allergies: data.allergies,
          emergencyContact: data.emergencyContact,
          emergencyPhone: data.emergencyPhone,
          enrollmentDate: data.enrollmentDate.toDate(),
          status: data.status,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        });
      });
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    // Filter by search term (name or parent name)
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by age range
    if (ageFilter) {
      filtered = filtered.filter((student) => {
        switch (ageFilter) {
          case '0-1':
            return student.age <= 1;
          case '2-3':
            return student.age >= 2 && student.age <= 3;
          case '4-5':
            return student.age >= 4 && student.age <= 5;
          case '6+':
            return student.age >= 6;
          default:
            return true;
        }
      });
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleExportCSV = () => {
    exportToCSV(filteredStudents, 'lista-alunos');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Lista de Alunos ({filteredStudents.length})
              </h2>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800" />
              <input
                type="text"
                placeholder="Buscar por nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-800" />
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="pl-10 w-full px-3 py-2 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todas as idades</option>
                <option value="0-1">0-1 ano</option>
                <option value="2-3">2-3 anos</option>
                <option value="4-5">4-5 anos</option>
                <option value="6+">6+ anos</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos os status</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setAgeFilter('');
                  setStatusFilter('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Idade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(student.birthDate)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {student.age} {student.age === 1 ? 'ano' : 'anos'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.parentName}</div>
                    <div className="text-sm text-gray-500">{student.parentEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPhone(student.parentPhone)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Emergência: {formatPhone(student.emergencyPhone)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(student.enrollmentDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {student.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => onEditStudent?.(student)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhum aluno encontrado
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {students.length === 0
                ? 'Nenhum aluno cadastrado ainda.'
                : 'Tente ajustar os filtros de busca.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
