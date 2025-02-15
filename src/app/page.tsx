"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function ChatPage() {
  const [input, setInput] = useState("");

  return (
    <div className={styles.container}>
      <h1>Chat Box</h1>

      <div className={styles.chatBox}>
        <p>No messages yet...</p>
      </div>

      <div className={styles.inputContainer}>
        <input
          type="text"
          className={styles.inputField}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter"}
        />
        <button className={styles.sendButton} onClick={() => {}}>
          Send
        </button>
      </div>
    </div>
  );
}
