import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, Activity, LogOut, Search, ArrowUpDown, Trash2, Edit, Save, X } from 'lucide-react';

const AdminPage = () => {
  const [key, setKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [logs, setLogs] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: '', password: '' });
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser1, setSelectedUser1] = useState('');
  const [selectedUser2, setSelectedUser2] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/auth', null, {
        headers: { 'admin-key': key }
      });
      setIsAuthenticated(true);
      fetchData();
    } catch (error) {
      alert('Invalid admin key');
    }
  };

  const fetchData = async () => {
    try {
      const config = {
        headers: { 'admin-key': key }
      };
      
      const [usersRes, messagesRes] = await Promise.all([
        axios.get('/api/admin/users', config),
        axios.get('/api/admin/messages', config)
      ]);
      setUsers(usersRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditForm({ fullName: user.fullName, password: '' });
  };

  const handleSave = async (userId) => {
    try {
      await axios.put(`/api/admin/users/${userId}`, editForm, {
        headers: { 'admin-key': key }
      });
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`/api/admin/messages/${messageId}`, {
        headers: { 'admin-key': key }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their messages.')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { 'admin-key': key }
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams();
      params.append('days', selectedDays);
      if (selectedUserForLogs) {
        params.append('userId', selectedUserForLogs);
      }
      
      const response = await axios.get(`/api/admin/logs?${params.toString()}`, {
        headers: { 'admin-key': key }
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'logs') {
      fetchLogs();
    }
  }, [isAuthenticated, activeTab, selectedDays, selectedUserForLogs]);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMessages = messages.filter(message => {
    const matchesUsers = (!selectedUser1 || message.senderId._id === selectedUser1 || message.receiverId._id === selectedUser1) &&
                        (!selectedUser2 || message.senderId._id === selectedUser2 || message.receiverId._id === selectedUser2);
    
    const searchMatch = !searchQuery || 
      message.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.senderId.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.receiverId.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesUsers && searchMatch;
  });

  const filteredAndSortedMessages = filteredMessages.sort((a, b) => {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <form onSubmit={handleAuth} className="w-96 space-y-4 rounded-lg bg-gray-800 p-8 shadow-xl">
          <h2 className="text-center text-2xl font-bold text-white">CIT Chat App</h2>
          <h3 className="text-center text-xl text-gray-300">Management System</h3>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter admin key"
            className="w-full rounded border border-gray-700 bg-gray-700 p-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            required
          />
          <button type="submit" className="w-full rounded bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* 左侧导航栏 */}
      <div className="w-64 bg-gray-800 p-6 flex flex-col h-screen">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">CIT Chat App</h1>
          <p className="text-sm text-gray-400">Management System</p>
        </div>
        
        <nav className="space-y-2 flex-1">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Users size={20} />
            <span>Users Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <MessageSquare size={20} />
            <span>Messages Management</span>
          </button>
          
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium ${
              activeTab === 'logs'
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Activity size={20} />
            <span>Activity Logs</span>
          </button>
        </nav>

        {/* 退出按钮 */}
        <button
          onClick={() => {
            localStorage.removeItem('adminKey');
            setIsAuthenticated(false);
          }}
          className="flex items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white mt-auto transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-8">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 p-3 pl-10 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {activeTab === 'users' && (
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Users Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-700 text-left text-sm font-medium text-gray-400">
                    <th className="p-4">Full Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="border-b border-gray-700 text-gray-300">
                      <td className="p-4">
                        {editingUser === user._id ? (
                          <input
                            type="text"
                            value={editForm.fullName}
                            onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            className="rounded border border-gray-600 bg-gray-700 p-1 text-white"
                          />
                        ) : (
                          user.fullName
                        )}
                      </td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        {editingUser === user._id ? (
                          <div className="flex space-x-2">
                            <input
                              type="password"
                              placeholder="New password"
                              value={editForm.password}
                              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                              className="rounded border border-gray-600 bg-gray-700 p-1 text-white"
                            />
                            <button
                              onClick={() => handleSave(user._id)}
                              className="rounded bg-green-600 p-2 text-white hover:bg-green-700"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="rounded bg-red-600 p-2 text-white hover:bg-red-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Messages Management</h2>
            
            <div className="mb-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">User 1</label>
                  <select
                    value={selectedUser1}
                    onChange={(e) => setSelectedUser1(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
                  >
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">User 2</label>
                  <select
                    value={selectedUser2}
                    onChange={(e) => setSelectedUser2(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
                  >
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {filteredMessages.length} messages found
                </span>
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 rounded bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
                >
                  <ArrowUpDown size={16} />
                  <span>Sort by Time ({sortOrder === 'asc' ? 'Oldest First' : 'Newest First'})</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredAndSortedMessages.length === 0 ? (
                <div className="text-center text-gray-400">
                  <MessageSquare className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">No messages found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {filteredAndSortedMessages.map((message) => (
                    <div key={message._id} className="flex items-start justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <span className="font-medium">{message.senderId.fullName}</span>
                          <span className="text-gray-500">→</span>
                          <span className="font-medium">{message.receiverId.fullName}</span>
                        </div>
                        <div className="mt-2 text-gray-300">
                          {message.text}
                          {message.image && (
                            <img src={message.image} alt="Message" className="mt-2 max-h-40 rounded" />
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="ml-4 rounded bg-red-600 p-2 text-white hover:bg-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="rounded-lg bg-gray-800 p-6 shadow-xl">
            <h2 className="mb-6 text-2xl font-bold text-white">Activity Logs</h2>
            
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Filter by User</label>
                <select
                  value={selectedUserForLogs}
                  onChange={(e) => setSelectedUserForLogs(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Time Range</label>
                <select
                  value={selectedDays}
                  onChange={(e) => setSelectedDays(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-700 bg-gray-700 p-2 text-white"
                >
                  <option value="1">Last 24 Hours</option>
                  <option value="7">Last 7 Days</option>
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {logs.length === 0 ? (
                <div className="text-center text-gray-400">
                  <Activity className="mx-auto h-12 w-12 opacity-50" />
                  <p className="mt-2">No activity logs found</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {logs.map((log) => (
                    <div key={log._id} className="flex items-center justify-between py-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`h-3 w-3 rounded-full ${log.action === 'login' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-medium text-white">{log.userName}</span>
                          <span className="text-gray-400">({log.userEmail})</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-400">
                          {log.action === 'login' ? 'Logged in' : 'Logged out'} at {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
