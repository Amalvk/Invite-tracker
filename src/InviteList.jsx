// src/components/InviteList.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const InviteList = () => {
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
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Invite Friends</h2>
      {friends.length === 0 ? (
        <p>No friends found.</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend) => (
            <li key={friend.id} className="border p-3 rounded-md shadow-sm">
              <h3 className="font-medium">{friend.name}</h3>
              <p className="text-sm text-gray-600">Category: {friend.category}</p>
              <p className="text-sm text-gray-600">
                Status: {friend.called ? "Called" : "Not Called"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InviteList;
