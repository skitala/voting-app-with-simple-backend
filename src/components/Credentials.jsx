import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Context";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Credentials = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [voters, setVoters] = useState(null);
  const [newVoters, setNewVoters] = useState(null);
  const [added, setAdded] = useState(false);
  const { verified, setVerified } = useContext(Context);

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleId = (e) => {
    setId(e.target.value);
  };

  const fetchVoters = async () => {
    const voters = await fetch("http://localhost:3000/voters");
    const votersData = await voters.json();
    setVoters(votersData);
  };

  const fetchNewVoters = async () => {
    const voters = await fetch("http://localhost:3000/voters");
    const votersData = await voters.json();
    setNewVoters(votersData);
  };

  useEffect(() => {
    fetchVoters();
  }, []);

  const verify = async () => {
    if ((name && id) !== "") {
      const data = await fetch("http://localhost:3000/voters", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: name,
          idNum: id,
        }),
      });
      await fetchNewVoters();

      setAdded(true);
      if (newVoters.length > voters.length) {
        setVerified(true);
      } else {
        setVerified(false);
        toast.error("You can not vote twice!");
      }

      return data;
    }
  };

  return (
    <div className="credentials">
      <h3 style={{ color: "#fff" }}>Your Name:</h3>
      <input type="text" className="input" onChange={handleName} />
      <h3 style={{ color: "#fff" }}>Your Id Number:</h3>
      <input type="number" className="input" onChange={handleId} />
      <button
        className="submitBtn"
        onClick={() => {
          verify();
          // setTimeout(() => check(), 2000);
        }}
      >
        {added === false ? "Verify" : "Confirm"}
      </button>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Credentials;
