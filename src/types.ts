export type UserRole = 'student' | 'warden';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  roomNumber?: string;
  regNumber?: string;
}

export type ComplaintCategory = 'Electrical' | 'Plumbing' | 'Cleaning' | 'Furniture' | 'Internet' | 'Other';

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber?: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: 'pending' | 'resolved';
  createdAt: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  wardenId: string;
  wardenName: string;
  targetStudentId?: string; // Optional: if null, it's a global notice
  targetStudentName?: string;
  createdAt: number;
}

export interface Outpass {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber?: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: number;
}

export interface MessMenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface MessFeedback {
  id: string;
  studentId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  rating: number; // 1-5
  comment?: string;
  createdAt: number;
}
