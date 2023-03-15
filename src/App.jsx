import { useState, useEffect, useRef } from "react";
import Credentials from "./components/Credentials";
import { Context } from "./context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [data, setData] = useState(null);
  const [partyId, setPartyId] = useState("");
  const [verified, setVerified] = useState(false);
  const [voted, setSuccessfulVote] = useState(false);

  const options = useRef([]);

  const fetchData = async () => {
    const res = await fetch("http://localhost:3000/votes");
    const data = await res.json();

    setData(data);
    console.log(data);
  };
  useEffect(() => {
    fetchData();
    console.log(data);
    if (verified) {
      options.current.map((btn) => (btn.disabled = false));
    }
  }, []);

  const vote = async (partyId) => {
    if (partyId != "") {
      const res = await fetch(`http://localhost:3000/votes/${partyId}`, {
        method: "PUT",
        // body: JSON.stringify(selected),
      });
      const updated = await res.json();

      return updated;
    }
    console.log("Voted successfully!");
  };

  if (verified === false) {
    options.current.map((btn) => (btn.disabled = true));
  } else {
    options.current.map((btn) => (btn.disabled = false));
  }
  voted ? options.current.map((btn) => (btn.disabled = true)) : "";

  return (
    <Context.Provider value={{ verified, setVerified }}>
      <div className="votingPool">
        <Credentials />
        {data
          ? data.map((party, index) => (
              <div className="option">
                <button
                  key={index}
                  onClick={() => {
                    const partyId = party.id;
                    setPartyId(partyId);

                    setTimeout(() => {
                      vote(partyId)
                        .then(
                          () => fetchData(),
                          setSuccessfulVote(true),
                          toast.success("Voted Successfully!")
                        )
                        .catch((err) => console.log(err));
                    }, 1000);

                    setTimeout(() => fetchData(), 3000);
                  }}
                  ref={(el) => (options.current[index] = el)}
                >
                  {party.party} : {party.percentage}% ({party.votes})
                </button>
                <div
                  key={party.id}
                  className="percentage"
                  style={{ width: `${party.percentage}%` }}
                ></div>
              </div>
            ))
          : ""}
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
    </Context.Provider>
  );
}

export default App;
