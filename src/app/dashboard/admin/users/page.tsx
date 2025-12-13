"use client";

import { useEffect, useState } from "react";
import { Users, Shield, Store, User as UserIcon, Edit, Trash2 } from "lucide-react";
import { useNotification } from "@/context/NotificationContext";
import AdminNavbar from "@/components/admin/AdminNavbar";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/dashboard/admin/users");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRole = (userId: string, currentRole: string) => {
    setEditingUser(userId);
    setNewRole(currentRole);
  };

  const handleSaveRole = async (userId: string) => {
    try {
      const res = await fetch(`/api/dashboard/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        showNotification("Role user berhasil diubah!", "success");
        fetchUsers();
        setEditingUser(null);
      } else {
        showNotification("Gagal mengubah role!", "error");
      }
    } catch (error) {
      showNotification("Error mengubah role!", "error");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Yakin ingin menghapus user "${userName}"?`)) return;

    try {
      const res = await fetch(`/api/dashboard/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        showNotification("User berhasil dihapus!", "success");
        fetchUsers();
      } else {
        showNotification("Gagal menghapus user!", "error");
      }
    } catch (error) {
      showNotification("Error menghapus user!", "error");
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="bg-white rounded-xl shadow p-6 animate-pulse h-96"></div>
        </div>
      </div>
      </>
    );
  }

  const buyers = users.filter((u) => u.role === "BUYER" || u.role === "buyer");
  const sellers = users.filter((u) => u.role === "SELLER" || u.role === "seller");
  const admins = users.filter((u) => u.role === "ADMIN" || u.role === "admin");

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">👥 Kelola User</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <UserIcon className="text-blue-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Buyers</p>
                <p className="text-3xl font-bold text-blue-600">{buyers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Store className="text-purple-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Sellers</p>
                <p className="text-3xl font-bold text-purple-600">{sellers.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <div className="flex items-center gap-3">
              <Shield className="text-orange-600" size={32} />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-3xl font-bold text-orange-600">{admins.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Daftar User</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Terdaftar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          className="px-3 py-1 text-xs font-bold rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="BUYER">BUYER</option>
                          <option value="SELLER">SELLER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                            user.role === "ADMIN" || user.role === "admin"
                              ? "bg-orange-100 text-orange-700"
                              : user.role === "SELLER" || user.role === "seller"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {editingUser === user._id ? (
                          <>
                            <button
                              onClick={() => handleSaveRole(user._id)}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600 transition-colors"
                            >
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingUser(null)}
                              className="px-3 py-1 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              Batal
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditRole(user._id, user.role)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Role"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id, user.name)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
