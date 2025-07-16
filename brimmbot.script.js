document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const userInput = document.getElementById("user-input").value;
  if (!userInput.trim()) return;

  const chatBox = document.getElementById("chat-box");

  // Show user's message
  const userBubble = document.createElement("div");
  userBubble.className = "message user-msg";
  userBubble.textContent = userInput;
  chatBox.appendChild(userBubble);

  document.getElementById("user-input").value = "";

  // Typing indicator
  const botTyping = document.createElement("div");
  botTyping.className = "message bot-msg typing-indicator";
  botTyping.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  chatBox.appendChild(botTyping);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("https://brimmbot-backend.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: userInput })
    });

    const data = await res.json();

    const replyBubble = document.createElement("div");
    replyBubble.className = "message bot-msg";
    replyBubble.textContent = data.reply;

    if (data.reply.length > 300) {
      replyBubble.classList.add("collapsed");
      replyBubble.addEventListener("click", () => {
        replyBubble.classList.toggle("collapsed");
      });
    }

    // Replace typing with reply
    botTyping.replaceWith(replyBubble);
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error("BrimmBot API error:", error);
    botTyping.outerHTML = `<div class="message bot-msg">⚠️ BrimmBot couldn’t connect. Please try again later!</div>`;
  }
});