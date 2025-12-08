export type UserRole = 'student' | 'staff' | 'admin';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'processing';

export type StreamType = 'cse' | 'ece' | 'mech' | 'civil' | 'eee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stream?: StreamType;
  year?: number;
  rollNo?: string;
  department?: string;
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  stream: StreamType;
  year: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  document?: string;
  status: LeaveStatus;
  appliedDate: string;
  approvals: ApprovalTimeline[];
}

export interface ApprovalTimeline {
  role: string;
  name: string;
  status: LeaveStatus;
  timestamp?: string;
  remarks?: string;
}

export interface DashboardStats {
  totalRequests: number;
  pending: number;
  approved: number;
  rejected: number;
  streamWise?: { [key in StreamType]?: number };
}
