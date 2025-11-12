import React, { useEffect, useState } from "react";
import "./style.css";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

const App = () => {
  const [friends, setFriends] = useState([]);
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

    fetchFriends();
  }, []);


  return (
    <div className="page">
      {/* Header */}
      <div className="header">
        <h1 className="title">Wedding Invitation Tracker</h1>
        <p className="subtitle">
          Organize and track your invitations beautifully.
        </p>
      </div>

      {/* Stats */}
      <div className="card">
        <div className="stats-row">
          <div>
            <span>
              <strong>Total Friends:</strong> 45
            </span>
            <span className="ml-12">
              <strong>Called:</strong> 28
            </span>
            <span className="ml-12">
              <strong>Pending:</strong> 17
            </span>
          </div>
          <button className="button">+ Add Category</button>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search friend name"
          className="input"
        />
      </div>

      {/* Category Section */}
      <div className="category-card">
        <div className="category-header">
          <h2 className="category-title">Local Friends</h2>
          <button className="button">+ Add Friend</button>
        </div>
        <p className="category-info">6 Total | 3 Called | 3 Pending</p>

        {/* Not Called */}
        <div className="section">
          <h3 className="section-title">Yet to inform</h3>
          <hr style={{ marginBlock: '1rem' }} />
          {friends.map((item, i) => (
            <div key={i} className="friend-row">
              <div className="profile">
                <span className="name">{item.name}</span>
                <span className="category">{item.category}</span>
              </div>
              {item.status == false &&<button className="friend-button">
                { "Called"}
              </button>}
            </div>
          ))}
        </div>

        {/* Called / Informed */}
        <div className="section">
          <h3 className="section-title">Called / Informed</h3>
          {["Sneha Iyer", "Ankit Tiwari", "Divya Patel"].map((name, i) => (
            <div key={i} className="friend-row">
              <span>{name}</span>
              <button className="friend-button">Undo</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
