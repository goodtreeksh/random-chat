// Firebase CDN에서 import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  where,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// === 🔥 Firebase 설정 ===
// 아래 내용을 너의 Firebase 프로젝트에서 복사한 걸로 바꿔라
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

let uid = null;
let roomId = null;

// === ✅ 로그인 & 매칭 ===
signInAnonymously(auth).then((userCred) => {
  uid = userCred.user.uid;
  findMatch();
});

async function findMatch() {
  const queueRef = collection(db, "queue");
  const snapshot = await getDocs(queueRef);

  let matched = false;
  for (const docSnap of snapshot.docs) {
    const otherUid = docSnap.id;
    if (otherUid !== uid) {
      // 상대 찾음 → 방 만들기
      roomId = uid + "_" + otherUid;
      await setDoc(doc(db, "rooms", roomId), {
        users: [uid, otherUid],
        created: Date.now()
      });
      await deleteDoc(doc(db, "queue", otherUid));
      matched = true;
      break;
    }
  }

  if (!matched) {
    // 큐에 자기 등록
    await setDoc(doc(queueRef, uid), { timestamp: Date.now() });
    watchForMatch();
  } else {
    startChat();
  }
}

function watchForMatch() {
  const roomsRef = collection(db, "rooms");
  const q = query(roomsRef, where("users", "array-contains", uid));
  const unsub = onSnapshot(q, (snapshot) => {
    snapshot.forEach((doc) => {
      roomId = doc.id;
      unsub();
      startChat();
    });
  });
}

function startChat() {
  document.getElementById("status").innerText = "채팅 시작됨!";
  const messagesRef = collection(db, "rooms", roomId, "messages");

  onSnapshot(messagesRef, (snapshot) => {
    const msgBox = document.getElementById("messages");
    msgBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const msg = doc.data();
      msgBox.innerHTML += `<div><b>${msg.sender === uid ? "나" : "상대"}:</b> ${msg.text}</div>`;
    });
    msgBox.scrollTop = msgBox.scrollHeight;
  });
}

async function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text || !roomId) return;
  input.value = "";

  const messagesRef = collection(db, "rooms", roomId, "messages");
  await addDoc(messagesRef, {
    sender: uid,
    text,
    timestamp: Date.now()
  });
}

// === 📌 버튼 클릭 연결 ===
document.getElementById("sendBtn").addEventListener("click", sendMessage);
