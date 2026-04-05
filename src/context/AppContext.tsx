import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Complaint, Notice, UserRole, Outpass, MessMenuItem, MessFeedback, EmergencyContact, ComplaintCategory } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  students: UserProfile[];
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: 'pending' | 'resolved') => void;
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void;
  outpasses: Outpass[];
  addOutpass: (outpass: Omit<Outpass, 'id' | 'createdAt' | 'status'>) => void;
  updateOutpassStatus: (id: string, status: 'approved' | 'rejected') => void;
  messMenu: MessMenuItem[];
  messFeedback: MessFeedback[];
  addMessFeedback: (feedback: Omit<MessFeedback, 'id' | 'createdAt'>) => void;
  emergencyContacts: EmergencyContact[];
  showToast: (message: string, type: 'success' | 'error') => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserProfile | null>(() => {
    const savedUser = localStorage.getItem('hostel_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [students, setStudents] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('hostel_students');
    return saved ? JSON.parse(saved) : [];
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('hostel_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('hostel_notices');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        title: 'Welcome to Smart Hostel',
        content: 'We are happy to have you here. Please follow the hostel rules.',
        wardenId: 'warden1',
        wardenName: 'Admin Warden',
        createdAt: Date.now() - 86400000,
      }
    ];
  });

  const [outpasses, setOutpasses] = useState<Outpass[]>(() => {
    const saved = localStorage.getItem('hostel_outpasses');
    return saved ? JSON.parse(saved) : [];
  });

  const [messFeedback, setMessFeedback] = useState<MessFeedback[]>(() => {
    const saved = localStorage.getItem('hostel_mess_feedback');
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const emergencyContacts: EmergencyContact[] = [
    { id: '1', name: 'Hostel Warden', role: 'Primary Warden', phone: '7206078584' },
    { id: '2', name: 'Medical Center', role: 'Emergency Health', phone: '011-2345678' },
    { id: '3', name: 'Security Desk', role: '24/7 Security', phone: '9876543210' },
    { id: '4', name: 'Electrician', role: 'Maintenance', phone: '8888877777' },
    { id: '5', name: 'Plumber', role: 'Maintenance', phone: '7777766666' },
  ];

  const messMenu: MessMenuItem[] = [
    { day: 'Monday', breakfast: 'Poha & Tea', lunch: 'Dal, Rice, Roti, Mix Veg', dinner: 'Paneer, Roti, Rice' },
    { day: 'Tuesday', breakfast: 'Aloo Paratha', lunch: 'Rajma, Rice, Roti', dinner: 'Aloo Gobhi, Roti, Dal' },
    { day: 'Wednesday', breakfast: 'Idli Sambhar', lunch: 'Kadhi, Rice, Roti', dinner: 'Egg Curry/Malai Kofta, Roti' },
    { day: 'Thursday', breakfast: 'Bread Butter & Jam', lunch: 'Chole Bhature', dinner: 'Mix Veg, Roti, Dal' },
    { day: 'Friday', breakfast: 'Upma', lunch: 'Dal Makhani, Rice, Roti', dinner: 'Bhindi Fry, Roti, Dal' },
    { day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Veg Pulao, Raita', dinner: 'Soya Chaap, Roti, Rice' },
    { day: 'Sunday', breakfast: 'Stuffed Paratha', lunch: 'Special Thali', dinner: 'Chicken/Paneer Biryani' },
  ];

  const setUser = (user: UserProfile | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('hostel_user', JSON.stringify(user));
      if (user.role === 'student') {
        setStudents(prev => {
          const index = prev.findIndex(s => s.uid === user.uid);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = user;
            return updated;
          }
          return [...prev, user];
        });
      }
    } else {
      localStorage.removeItem('hostel_user');
    }
  };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    // Cleanup specific test students from the PNG
    setStudents(prev => prev.filter(s => 
      !['nitin', 'shiiva'].includes(s.name.toLowerCase()) && 
      !s.name.includes('Abhinav Jain')
    ));
  }, []);

  useEffect(() => {
    localStorage.setItem('hostel_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('hostel_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('hostel_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('hostel_outpasses', JSON.stringify(outpasses));
  }, [outpasses]);

  useEffect(() => {
    localStorage.setItem('hostel_mess_feedback', JSON.stringify(messFeedback));
  }, [messFeedback]);

  const addComplaint = (data: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'pending',
    };
    setComplaints(prev => [newComplaint, ...prev]);
    showToast('Complaint filed successfully!', 'success');
  };

  const updateComplaintStatus = (id: string, status: 'pending' | 'resolved') => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    showToast(`Complaint marked as ${status}`, 'success');
  };

  const addNotice = (data: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setNotices(prev => [newNotice, ...prev]);
    showToast('Notice published!', 'success');
  };

  const addOutpass = (data: Omit<Outpass, 'id' | 'createdAt' | 'status'>) => {
    const newOutpass: Outpass = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'pending',
    };
    setOutpasses(prev => [newOutpass, ...prev]);
    showToast('Outpass request submitted!', 'success');
  };

  const updateOutpassStatus = (id: string, status: 'approved' | 'rejected') => {
    setOutpasses(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    showToast(`Outpass ${status}`, status === 'approved' ? 'success' : 'error');
  };

  const addMessFeedback = (data: Omit<MessFeedback, 'id' | 'createdAt'>) => {
    const newFeedback: MessFeedback = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    setMessFeedback(prev => [newFeedback, ...prev]);
    showToast('Feedback submitted!', 'success');
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      students,
      complaints,
      addComplaint,
      updateComplaintStatus,
      notices,
      addNotice,
      outpasses,
      addOutpass,
      updateOutpassStatus,
      messMenu,
      messFeedback,
      addMessFeedback,
      emergencyContacts,
      showToast,
      logout
    }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={cn(
              "fixed bottom-4 right-4 z-50 flex items-center space-x-2 rounded-lg px-4 py-3 shadow-lg text-white",
              toast.type === 'success' ? "bg-green-600" : "bg-red-600"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
