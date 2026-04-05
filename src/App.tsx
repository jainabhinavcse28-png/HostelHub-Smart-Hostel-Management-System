import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { UserRole } from './types';
import { Button } from './components/ui/Button';
import { Input, Label } from './components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/Card';
import { Tabs } from './components/ui/Tabs';
import { User, ShieldCheck, Info, LogOut, ClipboardList, Bell, PlusCircle, CheckCircle2, Clock, FileText, Utensils, Search, UserCircle, Calendar, Star, BarChart3, PhoneCall, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatDate, cn } from './lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ComplaintCategory } from './types';

const HOSTEL_BLOCKS: Record<string, string> = {
  A: 'Aravali Block',
  B: 'Brahmaputra Block',
  C: 'Cauvery Block',
  D: 'Dhaulagiri Block',
  E: 'Everest Block',
  F: 'Fuji Block',
  G: 'Ganga Block',
  H: 'Himalaya Block',
  I: 'Indus Block',
  J: 'Jhelum Block',
  K: 'Kailash Block',
  L: 'Lhotse Block',
  M: 'Mansarovar Block',
  N: 'Nilgiri Block',
  O: 'Olympus Block',
  P: 'Pamban Block',
  Q: 'Qomolangma Block',
  R: 'Ravi Block',
  S: 'Satluj Block',
  T: 'Tagore Block',
  U: 'Udaygiri Block',
  V: 'Vindhya Block',
  W: 'Western Ghats Block',
  X: 'Xizang Block',
  Y: 'Yamuna Block',
  Z: 'Zanskar Block',
};

const getHostelName = (roomNumber?: string) => {
  if (!roomNumber) return 'Main Block';
  const firstChar = roomNumber.charAt(0).toUpperCase();
  return HOSTEL_BLOCKS[firstChar] || 'Main Block';
};

function Login() {
  const { setUser, students } = useApp();
  const [role, setRole] = useState<UserRole>('student');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || (role === 'student' && !regNumber) || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password !== '1234' && role === 'student') {
      setError('Invalid password. Hint: 1234');
      setIsLoading(false);
      return;
    }

    if (role === 'warden' && password !== 'admin123') {
      setError('Invalid warden password');
      setIsLoading(false);
      return;
    }

    if (role === 'student') {
      // Check if registration number is already taken by someone else
      const existingStudent = students.find(s => s.regNumber === regNumber);
      if (existingStudent && existingStudent.name.toLowerCase() !== name.toLowerCase()) {
        setError('This registration number is already registered with another name.');
        setIsLoading(false);
        return;
      }
    }

    const uid = role === 'student' ? regNumber : 'warden_admin';
    setUser({
      uid,
      email: `${name.toLowerCase().replace(/\s/g, '')}@hostel.com`,
      name,
      role,
      roomNumber: role === 'student' ? room : undefined,
      regNumber: role === 'student' ? regNumber : undefined,
    });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">HostelHub</CardTitle>
          <CardDescription>Smart Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-2 text-center text-xs font-medium text-red-600">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label>Login as</Label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={role === 'student' ? 'primary' : 'outline'}
                  className="flex-1"
                  onClick={() => { setRole('student'); setError(''); }}
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant={role === 'warden' ? 'primary' : 'outline'}
                  className="flex-1"
                  onClick={() => { setRole('warden'); setError(''); }}
                >
                  Warden
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reg">Registration Number</Label>
                  <Input
                    id="reg"
                    placeholder="e.g. 2023CS001"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room">Room Number</Label>
                  <Input
                    id="room"
                    placeholder="e.g. B-204"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authenticating...</span>
                </div>
              ) : 'Get Started'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentDashboard() {
  const { user, complaints, notices, addComplaint, outpasses, addOutpass, messMenu, addMessFeedback, emergencyContacts } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('file');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintCategory, setComplaintCategory] = useState<ComplaintCategory>('Other');
  
  // Outpass state
  const [outpassReason, setOutpassReason] = useState('');
  const [outpassStart, setOutpassStart] = useState('');
  const [outpassEnd, setOutpassEnd] = useState('');

  // Mess feedback state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addComplaint({
      studentId: user.uid,
      studentName: user.name,
      roomNumber: user.roomNumber,
      title: complaintTitle,
      description: complaintDesc,
      category: complaintCategory,
    });
    setComplaintTitle('');
    setComplaintDesc('');
    setComplaintCategory('Other');
    setActiveSubTab('file');
  };

  const handleSubmitOutpass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addOutpass({
      studentId: user.uid,
      studentName: user.name,
      roomNumber: user.roomNumber,
      reason: outpassReason,
      startDate: outpassStart,
      endDate: outpassEnd,
    });
    setOutpassReason('');
    setOutpassStart('');
    setOutpassEnd('');
    alert('Outpass request submitted!');
  };

  const handleSubmitMessFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addMessFeedback({
      studentId: user.uid,
      mealType,
      rating,
      comment,
    });
    setComment('');
    alert('Thank you for your feedback!');
  };

  const studentComplaints = complaints.filter(c => c.studentId === user?.uid);
  const studentNotices = notices.filter(n => !n.targetStudentId || n.targetStudentId === user?.uid);
  const studentOutpasses = outpasses.filter(o => o.studentId === user?.uid);

  return (
    <div className="space-y-6">
      <Tabs
        tabs={[
          { id: 'file', label: 'Complaint', icon: <PlusCircle size={18} /> },
          { id: 'outpass', label: 'Outpass', icon: <FileText size={18} /> },
          { id: 'mess', label: 'Mess', icon: <Utensils size={18} /> },
          { id: 'notices', label: 'Notices', icon: <Bell size={18} /> },
          { id: 'emergency', label: 'Emergency', icon: <PhoneCall size={18} /> },
          { id: 'profile', label: 'Profile', icon: <UserCircle size={18} /> },
        ]}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
      />

      <AnimatePresence mode="wait">
        {activeSubTab === 'file' && (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle>Register a Complaint</CardTitle>
                <CardDescription>Describe the issue you're facing in your room or hostel premises.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitComplaint} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Fan not working"
                      value={complaintTitle}
                      onChange={(e) => setComplaintTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value as ComplaintCategory)}
                    >
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Internet">Internet</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Detailed Description</Label>
                    <textarea
                      id="desc"
                      className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      placeholder="Explain the problem in detail..."
                      value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Complaint</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">My Complaints</h3>
              {studentComplaints.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">No complaints filed yet.</Card>
              ) : (
                studentComplaints.map(complaint => (
                  <Card key={complaint.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>
                          Filed by: {complaint.studentName} • {formatDate(complaint.createdAt)}
                        </CardDescription>
                      </div>
                      <div className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        complaint.status === 'resolved' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {complaint.status.toUpperCase()}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {complaint.category}
                      </div>
                      <p className="text-sm text-slate-600">{complaint.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'outpass' && (
          <motion.div
            key="outpass"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Request Outpass</CardTitle>
                <CardDescription>Request permission to leave the hostel for a specific period.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOutpass} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Leave</Label>
                    <Input
                      id="reason"
                      placeholder="e.g. Going home for weekend"
                      value={outpassReason}
                      onChange={(e) => setOutpassReason(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Start Date</Label>
                      <Input
                        id="start"
                        type="date"
                        value={outpassStart}
                        onChange={(e) => setOutpassStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end">End Date</Label>
                      <Input
                        id="end"
                        type="date"
                        value={outpassEnd}
                        onChange={(e) => setOutpassEnd(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Submit Request</Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">My Outpass History</h3>
              {studentOutpasses.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">No outpass requests yet.</Card>
              ) : (
                studentOutpasses.map(o => (
                  <Card key={o.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div>
                        <CardTitle className="text-lg">{o.reason}</CardTitle>
                        <CardDescription>
                          {o.startDate} to {o.endDate}
                        </CardDescription>
                      </div>
                      <div className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                        o.status === 'approved' ? "bg-green-100 text-green-700" : 
                        o.status === 'rejected' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {o.status.toUpperCase()}
                      </div>
                    </CardHeader>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'mess' && (
          <motion.div
            key="mess"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Mess Menu</CardTitle>
                <CardDescription>Check what's cooking today!</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                        <th className="px-4 py-3">Day</th>
                        <th className="px-4 py-3">Breakfast</th>
                        <th className="px-4 py-3">Lunch</th>
                        <th className="px-4 py-3">Dinner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {messMenu.map((item) => (
                        <tr key={item.day} className={cn(
                          "hover:bg-slate-50/50",
                          new Date().toLocaleDateString('en-US', { weekday: 'long' }) === item.day && "bg-blue-50/50 font-medium"
                        )}>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.day}</td>
                          <td className="px-4 py-3 text-slate-600">{item.breakfast}</td>
                          <td className="px-4 py-3 text-slate-600">{item.lunch}</td>
                          <td className="px-4 py-3 text-slate-600">{item.dinner}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mess Feedback</CardTitle>
                <CardDescription>Rate your recent meal.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitMessFeedback} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Meal Type</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={mealType}
                        onChange={(e) => setMealType(e.target.value as any)}
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (1-5)</Label>
                      <div className="flex items-center space-x-1 pt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={cn(
                              "text-2xl transition-colors",
                              rating >= star ? "text-amber-400" : "text-slate-200"
                            )}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="m-comment">Comment (Optional)</Label>
                    <Input
                      id="m-comment"
                      placeholder="Any suggestions for improvement?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Feedback</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeSubTab === 'notices' && (
          <motion.div
            key="notices"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {studentNotices.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">No notices at the moment.</Card>
            ) : (
              studentNotices.map(notice => (
                <Card key={notice.id} className={cn(
                  "border-l-4",
                  notice.targetStudentId ? "border-l-amber-500 bg-amber-50/30" : "border-l-blue-500"
                )}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{notice.title}</CardTitle>
                        {notice.targetStudentId && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 uppercase">
                            Personal
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{formatDate(notice.createdAt)}</span>
                    </div>
                    <CardDescription>By {notice.wardenName}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{notice.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {activeSubTab === 'emergency' && (
          <motion.div
            key="emergency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-xl bg-red-50 p-6 border border-red-100">
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold">Emergency Protocol</h3>
              </div>
              <p className="text-sm text-red-700">
                In case of fire, medical emergency, or security threat, please contact the relevant authorities immediately. 
                Keep your room number and registration details ready.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {emergencyContacts
                .filter(contact => !['Electrician', 'Plumber'].includes(contact.name))
                .map(contact => (
                <Card key={contact.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
                      <PhoneCall size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{contact.name}</h4>
                      <p className="text-xs text-slate-500">{contact.role}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 text-center text-xs font-mono text-slate-600">
                    {contact.phone}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'profile' && user && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center space-y-8 py-4"
          >
            {/* Digital ID Card */}
            <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 p-6 text-white shadow-2xl">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />
              
              <div className="flex items-center justify-between border-b border-white/20 pb-4">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={24} />
                  <span className="font-bold tracking-tight">HostelHub ID</span>
                </div>
                <div className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">Student</div>
              </div>

              <div className="mt-6 flex space-x-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-white/20 p-1 backdrop-blur-sm">
                  <div className="flex h-full w-full items-center justify-center bg-slate-200 text-slate-400">
                    <User size={48} />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase text-blue-100">Full Name</p>
                    <p className="text-lg font-bold leading-tight">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-blue-100">Reg Number</p>
                    <p className="font-mono text-sm">{user.regNumber}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/20 pt-4">
                <div>
                  <p className="text-[10px] uppercase text-blue-100">Room No</p>
                  <p className="font-bold">{user.roomNumber}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-blue-100">Hostel</p>
                  <p className="font-bold">
                    {getHostelName(user.roomNumber)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="h-8 w-full rounded bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="h-4 w-3/4 bg-white/20 rounded-full animate-pulse" />
                </div>
              </div>
            </div>

            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-center">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-slate-500">Email</span>
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-slate-500">Role</span>
                  <span className="text-sm font-medium capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WardenDashboard() {
  const { user, students, complaints, notices, addNotice, updateComplaintStatus, outpasses, updateOutpassStatus, emergencyContacts } = useApp();
  const [activeSubTab, setActiveSubTab] = useState('complaints');
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [targetStudentId, setTargetStudentId] = useState('all');
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = complaintFilter === 'all' || c.status === complaintFilter;
    const matchesSearch = 
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingOutpasses = outpasses.filter(o => o.status === 'pending');

  // Analytics Data
  const complaintsByCategory = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(complaintsByCategory).map(([name, value]) => ({ name, value }));
  
  const statusData = [
    { name: 'Pending', value: complaints.filter(c => c.status === 'pending').length },
    { name: 'Resolved', value: complaints.filter(c => c.status === 'resolved').length },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

  const handlePushNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const targetStudent = targetStudentId === 'all' ? undefined : students.find(s => s.uid === targetStudentId);

    addNotice({
      title: noticeTitle,
      content: noticeContent,
      wardenId: user.uid,
      wardenName: user.name,
      targetStudentId: targetStudent?.uid,
      targetStudentName: targetStudent?.name,
    });
    setNoticeTitle('');
    setNoticeContent('');
    setTargetStudentId('all');
    alert(targetStudent ? `Notice sent to ${targetStudent.name}!` : 'Global notice published!');
  };

  return (
    <div className="space-y-6">
      <Tabs
        tabs={[
          { id: 'complaints', label: 'Complaints', icon: <ClipboardList size={18} /> },
          { id: 'outpasses', label: 'Outpasses', icon: <FileText size={18} /> },
          { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
          { id: 'push', label: 'Push Notice', icon: <PlusCircle size={18} /> },
          { id: 'emergency', label: 'Emergency', icon: <PhoneCall size={18} /> },
        ]}
        activeTab={activeSubTab}
        onChange={setActiveSubTab}
      />

      <AnimatePresence mode="wait">
        {activeSubTab === 'complaints' && (
          <motion.div
            key="complaints"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-blue-600 uppercase">Total</p>
                  <p className="text-2xl font-bold text-blue-900">{complaints.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 border-amber-100">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-amber-600 uppercase">Pending</p>
                  <p className="text-2xl font-bold text-amber-900">{complaints.filter(c => c.status === 'pending').length}</p>
                </CardContent>
              </Card>
              <Card className="bg-green-50 border-green-100">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-green-600 uppercase">Resolved</p>
                  <p className="text-2xl font-bold text-green-900">{complaints.filter(c => c.status === 'resolved').length}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-100">
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-slate-600 uppercase">Students</p>
                  <p className="text-2xl font-bold text-slate-900">{students.length}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Search by name, room, or issue..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                {(['all', 'pending', 'resolved'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setComplaintFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors",
                      complaintFilter === f 
                        ? "bg-blue-600 text-white" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {filteredComplaints.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">No complaints found.</Card>
            ) : (
              filteredComplaints.map(complaint => (
                <Card key={complaint.id} className={cn(complaint.status === 'resolved' && "opacity-60")}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <div className="mb-1 inline-block rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {complaint.category}
                      </div>
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                      <CardDescription>
                        From: {complaint.studentName} (Room: {complaint.roomNumber}) • {formatDate(complaint.createdAt)}
                      </CardDescription>
                    </div>
                    {complaint.status === 'pending' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50 hover:text-green-700"
                        onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                      >
                        <CheckCircle2 size={16} className="mr-1" /> Mark Resolved
                      </Button>
                    ) : (
                      <div className="flex items-center text-green-600 text-xs font-bold">
                        <CheckCircle2 size={16} className="mr-1" /> RESOLVED
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">{complaint.description}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {activeSubTab === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Complaints by Category</CardTitle>
                  <CardDescription>Distribution of issues across different departments.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resolution Status</CardTitle>
                  <CardDescription>Comparison between pending and resolved issues.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Insights</CardTitle>
                <CardDescription>Automated summary of hostel operations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 rounded-lg bg-slate-50 p-4">
                  <div className="mt-1 rounded-full bg-blue-100 p-2 text-blue-600">
                    <Info size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">High Volume Alert</p>
                    <p className="text-xs text-slate-500">
                      There has been a 20% increase in {Object.keys(complaintsByCategory).sort((a,b) => complaintsByCategory[b] - complaintsByCategory[a])[0] || 'maintenance'} complaints this week.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-lg bg-slate-50 p-4">
                  <div className="mt-1 rounded-full bg-green-100 p-2 text-green-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Resolution Efficiency</p>
                    <p className="text-xs text-slate-500">
                      Warden team has resolved {complaints.filter(c => c.status === 'resolved').length} issues so far. Keep it up!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeSubTab === 'emergency' && (
          <motion.div
            key="emergency"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              {emergencyContacts.map(contact => (
                <Card key={contact.id} className="overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="mr-4 rounded-full bg-blue-100 p-3 text-blue-600">
                      <PhoneCall size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{contact.name}</h4>
                      <p className="text-xs text-slate-500">{contact.role}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                    >
                      Call
                    </a>
                  </div>
                  <div className="bg-slate-50 px-4 py-2 text-center text-xs font-mono text-slate-600">
                    {contact.phone}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'outpasses' && (
          <motion.div
            key="outpasses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-slate-800">Pending Outpass Requests</h3>
            {pendingOutpasses.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">No pending outpass requests.</Card>
            ) : (
              pendingOutpasses.map(o => (
                <Card key={o.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg">{o.reason}</CardTitle>
                      <CardDescription>
                        From: {o.studentName} (Room: {o.roomNumber}) • {o.startDate} to {o.endDate}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:bg-green-50"
                        onClick={() => updateOutpassStatus(o.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => updateOutpassStatus(o.id, 'rejected')}
                      >
                        Reject
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {activeSubTab === 'push' && (
          <motion.div
            key="push"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Publish Notice</CardTitle>
                <CardDescription>Broadcast important information to all students.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePushNotice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="n-target">Target Recipient</Label>
                    <select
                      id="n-target"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      value={targetStudentId}
                      onChange={(e) => setTargetStudentId(e.target.value)}
                    >
                      <option value="all">All Students (Global)</option>
                      {students.map(student => (
                        <option key={student.uid} value={student.uid}>
                          {student.name} ({student.roomNumber} - {getHostelName(student.roomNumber)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n-title">Notice Title</Label>
                    <Input
                      id="n-title"
                      placeholder="e.g. Water Supply Interruption"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n-content">Notice Content</Label>
                    <textarea
                      id="n-content"
                      className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      placeholder="Write the notice details here..."
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Publish Notice</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function About() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>About HostelHub</CardTitle>
          <CardDescription>Version 1.0.0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            HostelHub is a smart management system designed to bridge the gap between students and hostel administration.
            Our goal is to streamline communication, automate grievance redressal, and ensure timely dissemination of information.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="font-semibold text-blue-700">For Students</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-blue-600 space-y-1">
                <li>Easy complaint filing</li>
                <li>Real-time status tracking</li>
                <li>Instant notice notifications</li>
              </ul>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-700">For Wardens</h4>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600 space-y-1">
                <li>Centralized complaint view</li>
                <li>One-click resolution</li>
                <li>Global notice broadcasting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none">
        <CardHeader>
          <CardTitle className="text-white">Developer Information</CardTitle>
          <CardDescription className="text-blue-100">Project developed by Abhinav Jain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Developer:</span>
            <span className="text-sm">Abhinav Jain</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Email:</span>
            <a href="mailto:jain.abhinav.cse@gmail.com" className="text-sm hover:underline">jain.abhinav.cse@gmail.com</a>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Phone:</span>
            <a href="tel:7206078584" className="text-sm hover:underline">7206078584</a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Dashboard() {
  const { user, logout } = useApp();
  const [activeTab, setActiveTab] = useState('main');

  if (!user) return <Login />;

  const tabs = [
    { id: 'main', label: user.role === 'student' ? 'Student' : 'Warden', icon: user.role === 'student' ? <User size={18} /> : <ShieldCheck size={18} /> },
    { id: 'about', label: 'About', icon: <Info size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-600 p-1.5 text-white">
              <ShieldCheck size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">HostelHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">
                {user.role} {user.regNumber && `• ${user.regNumber}`} {user.roomNumber && `• ${user.roomNumber}`}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-500 hover:text-red-600">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-8 flex-grow">
        <div className="mb-8">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="max-w-xs" />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              {user.role === 'student' ? <StudentDashboard /> : <WardenDashboard />}
            </motion.div>
          )}
          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <About />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-black text-slate-400 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-xs">
            More ways to manage: Visit the <a href="#" className="text-blue-500 hover:underline">Hostel Directory</a> or visit <a href="#" className="text-blue-500 hover:underline">Complaint Portal</a>.
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-[10px] space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2">
              <span>Copyright © 2026 HostelHub Inc. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-slate-700">|</span>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <span className="text-slate-700">|</span>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                <span className="text-slate-700">|</span>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
            <div className="font-semibold text-white">India</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}

