import { useState, useEffect } from "react";
import axios from "axios";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        console.log("🔍 Fetching contacts with token:", token);
        const response = await axios.get(
          "http://localhost:5000/api/contact/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { status: "pending" },
          }
        );
        console.log("API Response:", response.data); // Debug log

        // Update to handle direct array or data property
        const contactsData = response.data.data || response.data || [];
        setContacts(contactsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        setError(error.response?.data?.message || "Failed to load contacts");
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  const handleApprove = async (contactId) => {
    try {
      const token = getAuthToken();
      console.log("🔍 Approving contact with token:", token);
      await axios.put(
        `http://localhost:5000/api/contact/${contactId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Refresh contacts after approval
      setContacts(contacts.filter((contact) => contact._id !== contactId));
    } catch (error) {
      console.error("Error approving contact:", error);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      const token = getAuthToken();
      console.log("🔍 Deleting contact with token:", token);
      await axios.delete(`http://localhost:5000/api/contact/${contactId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(contacts.filter((contact) => contact._id !== contactId));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Phản hồi người dùng</h1>
      {contacts.length === 0 ? (
        <p className="text-center text-gray-500">Không có phản hồi nào</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={contact.userId?.avatar || ""}
                  alt={contact.userId?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{contact.userId?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {contact.userId?.email}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{contact.message}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleApprove(contact._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Thông qua
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactsPage;
