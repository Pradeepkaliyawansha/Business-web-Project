import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  ShieldOff,
  Trash2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
import Loader from "../../components/common/Loader";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user) => {
    if (user._id === currentUser._id) {
      toast.error("You can't change your own role");
      return;
    }
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await api.put(`/users/${user._id}`, {
        role: newRole,
        isActive: user.isActive,
      });
      toast.success(`User role changed to ${newRole}!`);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted!");
      setDeleteConfirm(null);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl">
      <div className="mb-8">
        <h1
          className="font-display font-bold text-3xl"
          style={{ color: "var(--text-primary)" }}
        >
          Users
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {users.length} registered users
        </p>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <Users
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: "var(--border-color-dark)" }}
            />
            <p style={{ color: "var(--text-muted)" }}>
              No users registered yet
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: "var(--table-header-bg)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  {["User", "Joined", "Role", "Status", "Actions"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`text-left px-${i === 0 || i === 4 ? 5 : 4} py-3.5 text-xs font-semibold uppercase tracking-wider ${
                          i === 1
                            ? "hidden md:table-cell"
                            : i === 3
                              ? "hidden sm:table-cell"
                              : ""
                        } ${i === 4 ? "text-right" : ""}`}
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b transition-colors"
                    style={{
                      borderColor: "var(--border-color)",
                      backgroundColor:
                        user._id === currentUser._id
                          ? "rgba(249,115,22,0.03)"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (user._id !== currentUser._id)
                        e.currentTarget.style.backgroundColor =
                          "var(--table-row-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        user._id === currentUser._id
                          ? "rgba(249,115,22,0.03)"
                          : "transparent";
                    }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary-400 text-sm">
                            {user.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {user.name}
                            </p>
                            {user._id === currentUser._id && (
                              <span className="badge-orange text-xs">You</span>
                            )}
                          </div>
                          <p
                            className="text-xs truncate"
                            style={{ color: "var(--text-dimmer)" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`badge text-xs ${user.role === "admin" ? "badge-orange" : "badge-gray"}`}
                      >
                        {user.role === "admin" ? "🛡️ Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span
                        className={`badge text-xs ${user.isActive ? "badge-green" : "badge-red"}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {user._id !== currentUser._id && (
                          <>
                            <button
                              onClick={() => toggleRole(user)}
                              title={
                                user.role === "admin"
                                  ? "Remove admin"
                                  : "Make admin"
                              }
                              className={`p-1.5 rounded-lg border transition-all ${user.role === "admin" ? "bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20" : "hover:text-orange-400 hover:border-orange-500/30"}`}
                              style={
                                user.role !== "admin"
                                  ? {
                                      backgroundColor: "var(--bg-surface-2)",
                                      borderColor: "var(--border-color-dark)",
                                      color: "var(--text-muted)",
                                    }
                                  : {}
                              }
                            >
                              {user.role === "admin" ? (
                                <ShieldOff className="w-3.5 h-3.5" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(user)}
                              className="p-1.5 rounded-lg border transition-all hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                              style={{
                                backgroundColor: "var(--bg-surface-2)",
                                borderColor: "var(--border-color-dark)",
                                color: "var(--text-muted)",
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="modal-box p-6 max-w-sm w-full animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-400" />
              </div>
              <h3
                className="font-display font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                Delete User?
              </h3>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              Permanently delete{" "}
              <span
                className="font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                "{deleteConfirm.name}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-secondary flex-1 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
