import React, { useEffect, useState } from "react";
import axios from "axios";

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔹 सभी सदस्यों को लोड करें
  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/members");
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 🔹 सदस्य डिलीट करें
  const handleDelete = async (id) => {
    if (!window.confirm("क्या आप वाकई इस सदस्य को डिलीट करना चाहते हैं?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/members/${id}`);
      setMembers(members.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // 🔹 एडिट शुरू करें
  const startEditing = (member) => {
    setEditingMember(member._id);
    setFormData(member);
  };

  // 🔹 इनपुट बदलें
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 अपडेट सबमिट करें
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/members/${editingMember}`,
        formData
      );
      setMembers(
        members.map((m) =>
          m._id === editingMember ? res.data.updatedMember : m
        )
      );
      setEditingMember(null);
      alert("Member updated successfully!");
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading members...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
        Manage Members ({members.length})
      </h2>

      {members.length === 0 ? (
        <p className="text-center text-gray-500">No members found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Age</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Plan Type</th>
                <th className="py-3 px-4">Cash Paid</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member._id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  {editingMember === member._id ? (
                    <>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="contact"
                          value={formData.contact}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="text"
                          name="planType"
                          value={formData.planType}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          type="number"
                          name="cashAmountPaid"
                          value={formData.cashAmountPaid}
                          onChange={handleChange}
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-600 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMember(null)}
                          className="bg-gray-500 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4">{member.name}</td>
                      <td className="py-2 px-4">{member.age}</td>
                      <td className="py-2 px-4">{member.gender}</td>
                      <td className="py-2 px-4">{member.contact}</td>
                      <td className="py-2 px-4">{member.planType}</td>
                      <td className="py-2 px-4">{member.cashAmountPaid}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          onClick={() => startEditing(member)}
                          className="bg-blue-600 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberList;
