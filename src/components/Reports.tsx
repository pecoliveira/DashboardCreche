'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { FileDown, BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';
import { db } from '@/lib/firebase';
import { Student } from '@/types';
import { exportToCSV, formatDate } from '@/lib/utils';

export default function Reports() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    byAge: { '0-1': 0, '2-3': 0, '4-5': 0, '6+': 0 },
    recentEnrollments: 0,
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [students]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      
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

  const calculateStats = () => {
    if (!students.length) return;

    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const inactive = students.filter(s => s.status === 'inactive').length;

    const byAge = {
      '0-1': students.filter(s => s.age <= 1).length,
      '2-3': students.filter(s => s.age >= 2 && s.age <= 3).length,
      '4-5': students.filter(s => s.age >= 4 && s.age <= 5).length,
      '6+': students.filter(s => s.age >= 6).length,
    };

    // Students enrolled in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEnrollments = students.filter(s => s.enrollmentDate >= thirtyDaysAgo).length;

    setStats({
      total,
      active,
      inactive,
      byAge,
      recentEnrollments,
    });
  };

  const exportReports = {
    all: () => exportToCSV(students, 'relatorio-completo'),
    active: () => exportToCSV(students.filter(s => s.status === 'active'), 'alunos-ativos'),
    inactive: () => exportToCSV(students.filter(s => s.status === 'inactive'), 'alunos-inativos'),
    byAge: (ageRange: string) => {
      let filtered: Student[] = [];
      switch (ageRange) {
        case '0-1':
          filtered = students.filter(s => s.age <= 1);
          break;
        case '2-3':
          filtered = students.filter(s => s.age >= 2 && s.age <= 3);
          break;
        case '4-5':
          filtered = students.filter(s => s.age >= 4 && s.age <= 5);
          break;
        case '6+':
          filtered = students.filter(s => s.age >= 6);
          break;
      }
      exportToCSV(filtered, `alunos-${ageRange}-anos`);
    },
    recent: () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recent = students.filter(s => s.enrollmentDate >= thirtyDaysAgo);
      exportToCSV(recent, 'matriculas-recentes');
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="h-6 w-6 text-indigo-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">Relatórios e Estatísticas</h2>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">Total de Alunos</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">Alunos Ativos</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-red-600">Alunos Inativos</p>
                  <p className="text-2xl font-bold text-red-900">{stats.inactive}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">Matrículas Recentes</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.recentEnrollments}</p>
                  <p className="text-xs text-purple-600">Últimos 30 dias</p>
                </div>
              </div>
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Idade</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.byAge).map(([ageRange, count]) => (
                <div key={ageRange} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600">{ageRange} anos</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Exportar Relatórios</h3>
          <p className="text-sm text-gray-500">Baixe relatórios em formato CSV</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* General Reports */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Relatórios Gerais</h4>
              <div className="space-y-2">
                <button
                  onClick={exportReports.all}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <span>Todos os Alunos</span>
                  <FileDown className="h-4 w-4" />
                </button>
                <button
                  onClick={exportReports.active}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <span>Alunos Ativos</span>
                  <FileDown className="h-4 w-4" />
                </button>
                <button
                  onClick={exportReports.inactive}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
                >
                  <span>Alunos Inativos</span>
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Age Reports */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Por Faixa Etária</h4>
              <div className="space-y-2">
                {Object.entries(stats.byAge).map(([ageRange, count]) => (
                  <button
                    key={ageRange}
                    onClick={() => exportReports.byAge(ageRange)}
                    disabled={count === 0}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{ageRange} anos ({count})</span>
                    <FileDown className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Time-based Reports */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Por Período</h4>
              <div className="space-y-2">
                <button
                  onClick={exportReports.recent}
                  disabled={stats.recentEnrollments === 0}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Matrículas Recentes ({stats.recentEnrollments})</span>
                  <FileDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Enrollments Table */}
      {stats.recentEnrollments > 0 && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Matrículas Recentes</h3>
            <p className="text-sm text-gray-500">Alunos matriculados nos últimos 30 dias</p>
          </div>

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
                    Data de Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students
                  .filter(s => {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return s.enrollmentDate >= thirtyDaysAgo;
                  })
                  .sort((a, b) => b.enrollmentDate.getTime() - a.enrollmentDate.getTime())
                  .map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.age} {student.age === 1 ? 'ano' : 'anos'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(student.enrollmentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.parentName}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
