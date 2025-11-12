import React, { useEffect, useState } from "react";
import "./style.css";
import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";

const InviteList = () => {
  const [friends, setFriends] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: "", category: "" });

  // Fetch data
  useEffect(() => {
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

  // Handle add friend submit
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

      // Refresh the list
      const querySnapshot = await getDocs(collection(db, "inviteFriends"));
      setFriends(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (error) {
      console.error("Error adding friend:", error);
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
              <strong>Pending:</strong>{" "}
              {friends.filter((f) => !f.status).length}
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
          {friends
            .filter((f) => !f.status)
            .map((item, i) => (
              <div key={i} className="friend-row">
                <div style={{ display: 'flex', gap: '5px', marginTop: '1rem' }}>
                  <div>{i + 1}){" "}</div>
                  <div className="profile">
                    <span className="name">{item.name}</span>
                    <span className="category">{item.category}</span>
                  </div>

                </div> <button className="friend-button">Called</button>
              </div>
            ))}
        </div>

        {/* Called / Informed */}
        <div className="section">
          <h3 className="section-title">Called / Informed</h3>
           <hr style={{ marginBlock: "1rem" }} />
          {friends
            .filter((f) => f.status)
            .map((item, i) => (
              <div key={i} className="friend-row">
                <div style={{ display: 'flex', gap: '5px', marginTop: '1rem' }}>
                  <div>{i + 1}){" "}</div>
                  <div className="profile">
                    <span className="name">{item.name}</span>
                    <span className="category">{item.category}</span>
                  </div>

                </div> <button className="friend-button">Need to call </button>
              </div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New</h3>
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
      
    </div>
  );
};

export default InviteList;
