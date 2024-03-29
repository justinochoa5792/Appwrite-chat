import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "../AppWriteConfig";
import { ID, Query, Permission, Role } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      payload
    );

    //setMessages((prevState) => [response, ...messages]);
    setMessageBody("");
  };

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, message_id);
    setMessages((prevState) =>
      prevState.filter((message) => message.$id !== message_id)
    );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="1000"
              placeholder="Write something"
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => {
            return (
              <div key={message.$id} className="message--wrapper">
                <div className="message--header">
                  <p>
                    {message?.username ? (
                      <span>{message.username}</span>
                    ) : (
                      <span>Unknown user</span>
                    )}
                    <small className="message-timestamp">
                      {new Date(message.$createdAt).toLocaleString()}
                    </small>
                  </p>
                  <Trash2
                    className="delete--btn"
                    onClick={() => deleteMessage(message.$id)}
                  />
                </div>

                <div className="message--body">
                  <span>{message.body}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Room;
