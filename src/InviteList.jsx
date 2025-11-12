import React, { useEffect, useState } from "react";
import "./style.css";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

const InviteList = () => {
  const [friends, setFriends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: "", category: "" });

  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(""); // 'called', 'uncalled', or 'delete'
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Fetch all friends
  const fetchFriends = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "inviteFriends"));
      const friendList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFriends(friendList);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryRef = doc(db, "categories", "category");
        const categorySnap = await getDoc(categoryRef);
        if (categorySnap.exists()) {
          const data = categorySnap.data();
          setCategories(data?.categoryNames || []);
        } else {
          console.log("No category document found!");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchFriends();
    fetchCategories();
  }, []);

  // Add new friend
  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!newFriend.name || !newFriend.category) {
      alert("Please enter both name and category.");
      return;
    }

    try {
      await addDoc(collection(db, "inviteFriends"), {
        name: newFriend.name,
        category: newFriend.category,
        status: false,
        createdAt: Timestamp.now(),
      });
      setShowModal(false);
      setNewFriend({ name: "", category: "" });
      fetchFriends();
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  // Confirm action (called, uncalled, delete)
  const handleConfirmAction = async () => {
    if (!selectedFriend) return;

    try {
      const friendRef = doc(db, "inviteFriends", selectedFriend.id);

      if (confirmAction === "delete") {
        await deleteDoc(friendRef);
      } else {
        await updateDoc(friendRef, {
          status: confirmAction === "called",
        });
      }

      setConfirmModal(false);
      setSelectedFriend(null);
      fetchFriends();
    } catch (error) {
      console.error("Error performing action:", error);
    }
  };

  // Modal question text
  const getModalText = () => {
    if (!selectedFriend) return "";
    switch (confirmAction) {
      case "called":
        return `Did you inform ${selectedFriend.name}?`;
      case "uncalled":
        return `You didn’t call ${selectedFriend.name}?`;
      case "delete":
        return `Are you sure you want to delete ${selectedFriend.name}?`;
      default:
        return "";
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <h1 className="title">Wedding Invitation Tracker</h1>
        <p className="subtitle">Organize and track your invitations beautifully.</p>
      </div>

      {/* Stats */}
      <div className="card">
        <div className="stats-row">
          <div>
            <span>
              <strong>Total Friends:</strong> {friends.length}
            </span>
            <span className="ml-12">
              <strong>Called:</strong> {friends.filter((f) => f.status).length}
            </span>
            <span className="ml-12">
              <strong>Pending:</strong> {friends.filter((f) => !f.status).length}
            </span>
          </div>
          <button className="button" onClick={() => setShowModal(true)}>
            + Add Friend
          </button>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${
                (friends.filter((f) => f.status).length / (friends.length || 1)) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Category Section */}
      <div className="category-card">
        <div className="category-header">
          <h2 className="category-title">Friends List</h2>
        </div>

        {/* Yet to Inform */}
        <div className="section">
          <h3 className="section-title">Yet to inform</h3>
          <hr style={{ marginBlock: "1rem" }} />
          <div className="friend-list">
            {friends
              .filter((f) => !f.status)
              .map((item, i) => (
                <div key={i} className="friend-row">
                  <div style={{ display: "flex", gap: "5px", marginBlock: ".5rem" }}>
                    <div>{i + 1})</div>
                    <div className="profile">
                      <span className="name">{item.name}</span>
                      <span className="category">{item.category}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="friend-button"
                      onClick={() => {
                        setSelectedFriend(item);
                        setConfirmAction("called");
                        setConfirmModal(true);
                      }}
                    >
                      Called
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedFriend(item);
                        setConfirmAction("delete");
                        setConfirmModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            {friends.filter((f) => !f.status).length === 0 && (
              <div className="friend-row">No one yet to inform !!</div>
            )}
          </div>
        </div>

        {/* Called / Informed */}
        <div className="section">
          <h3 className="section-title">Called / Informed</h3>
          <hr style={{ marginBlock: "1rem" }} />
          <div className="friend-list">
          {friends
            .filter((f) => f.status)
            .map((item, i) => (
              <div key={i} className="friend-row">
                <div style={{ display: "flex", gap: "5px", marginBlock: ".5rem" }}>
                  <div>{i + 1})</div>
                  <div className="profile">
                    <span className="name">{item.name}</span>
                    <span className="category">{item.category}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="friend-button"
                    onClick={() => {
                      setSelectedFriend(item);
                      setConfirmAction("uncalled");
                      setConfirmModal(true);
                    }}
                  >
                    Undo
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelectedFriend(item);
                      setConfirmAction("delete");
                      setConfirmModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
        </div>
      </div>

      {/* Add Friend Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Friend</h3>
            <form onSubmit={handleAddFriend}>
              <input
                type="text"
                placeholder="Enter friend name"
                value={newFriend.name}
                onChange={(e) =>
                  setNewFriend({ ...newFriend, name: e.target.value })
                }
                className="input"
                style={{ marginBottom: "12px" }}
              />

              <select
                value={newFriend.category}
                onChange={(e) =>
                  setNewFriend({ ...newFriend, category: e.target.value })
                }
                className="inputselect"
              >
                <option value="">Select category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="modal-actions">
                <button type="submit" className="button">
                  Submit
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={() => setShowModal(false)}
                  style={{ backgroundColor: "#eee", marginLeft: "8px" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && selectedFriend && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirmation</h3>
            <p>{getModalText()}</p>
            <div className="modal-actions">
              <button onClick={handleConfirmAction} className="button">
                Yes
              </button>
              <button
                onClick={() => {
                  setConfirmModal(false);
                  setSelectedFriend(null);
                }}
                className="button"
                style={{ backgroundColor: "#eee", marginLeft: "8px" }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InviteList;
