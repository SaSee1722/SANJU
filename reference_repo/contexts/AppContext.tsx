import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole, LeaveRequest } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (request: LeaveRequest) => void;
  updateLeaveRequest: (id: string, updates: Partial<LeaveRequest>) => void;
  switchRole: (role: UserRole) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      studentId: 'stu1',
      studentName: 'Priya Sharma',
      studentRollNo: 'CSE2021001',
      stream: 'cse',
      year: 3,
      leaveType: 'Medical Leave',
      startDate: '2025-12-15',
      endDate: '2025-12-17',
      days: 3,
      reason: 'Fever and medical consultation required',
      status: 'pending',
      appliedDate: '2025-12-08',
      approvals: [
        { role: 'Class Teacher', name: 'Dr. Kumar', status: 'pending' },
        { role: 'Program Coordinator', name: 'Dr. Mehta', status: 'pending' },
        { role: 'HOD', name: 'Dr. Singh', status: 'pending' },
      ],
    },
    {
      id: '2',
      studentId: 'stu2',
      studentName: 'Rahul Verma',
      studentRollNo: 'ECE2021045',
      stream: 'ece',
      year: 3,
      leaveType: 'Personal Leave',
      startDate: '2025-12-10',
      endDate: '2025-12-11',
      days: 2,
      reason: 'Family function attendance',
      status: 'approved',
      appliedDate: '2025-12-05',
      approvals: [
        { role: 'Class Teacher', name: 'Dr. Patel', status: 'approved', timestamp: '2025-12-05T10:30:00' },
        { role: 'Program Coordinator', name: 'Dr. Iyer', status: 'approved', timestamp: '2025-12-05T14:20:00' },
        { role: 'HOD', name: 'Dr. Reddy', status: 'approved', timestamp: '2025-12-06T09:15:00' },
      ],
    },
    {
      id: '3',
      studentId: 'stu3',
      studentName: 'Anjali Das',
      studentRollNo: 'MECH2021078',
      stream: 'mech',
      year: 2,
      leaveType: 'Emergency Leave',
      startDate: '2025-12-09',
      endDate: '2025-12-09',
      days: 1,
      reason: 'Medical emergency in family',
      status: 'rejected',
      appliedDate: '2025-12-08',
      approvals: [
        { role: 'Class Teacher', name: 'Dr. Sharma', status: 'approved', timestamp: '2025-12-08T11:00:00' },
        { role: 'Program Coordinator', name: 'Dr. Gupta', status: 'rejected', timestamp: '2025-12-08T15:30:00', remarks: 'Insufficient documentation provided' },
      ],
    },
  ]);

  const addLeaveRequest = (request: LeaveRequest) => {
    setLeaveRequests([request, ...leaveRequests]);
  };

  const updateLeaveRequest = (id: string, updates: Partial<LeaveRequest>) => {
    setLeaveRequests(leaveRequests.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
  };

  const switchRole = (role: UserRole) => {
    const mockUsers: { [key in UserRole]: User } = {
      student: {
        id: 'stu1',
        name: 'Priya Sharma',
        email: 'priya.sharma@college.edu',
        role: 'student',
        stream: 'cse',
        year: 3,
        rollNo: 'CSE2021001',
      },
      staff: {
        id: 'staff1',
        name: 'Dr. Kumar',
        email: 'kumar@college.edu',
        role: 'staff',
        department: 'Computer Science',
      },
      admin: {
        id: 'admin1',
        name: 'Prof. Singh',
        email: 'singh@college.edu',
        role: 'admin',
        department: 'Administration',
      },
    };
    setCurrentUser(mockUsers[role]);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      leaveRequests,
      addLeaveRequest,
      updateLeaveRequest,
      switchRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
