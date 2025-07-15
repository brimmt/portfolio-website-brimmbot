document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault(); // prevents default form behavior

  const userInput = document.getElementById("user-input").value;
  if (!userInput.trim()) return;

  const chatBox = document.getElementById("chat-box");

  // Show user's message
  const userBubble = document.createElement("div");
  userBubble.className = "message user-msg";
  userBubble.textContent = userInput;
  chatBox.appendChild(userBubble);

  // Clear input field
  document.getElementById("user-input").value = "";

  // Show "typing" indicator
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

  // Create final bot reply bubble
  const replyBubble = document.createElement("div");
  replyBubble.className = "message bot-msg";
  replyBubble.textContent = data.reply;

  // Auto-collapse long replies
  if (data.reply.length > 300) {
    replyBubble.classList.add("collapsed");
    replyBubble.addEventListener("click", () => {
      replyBubble.classList.toggle("collapsed");
    });
  }

  chatBox.appendChild(replyBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

} catch (error) {
  console.error("BrimmBot API error:", error);

  const errorBubble = document.createElement("div");
  errorBubble.className = "message bot-msg";
  errorBubble.textContent = "⚠️ BrimmBot couldn’t connect. Please try again later!";
  chatBox.appendChild(errorBubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

    // Replace typing indicator with final message
    botTyping.replaceWith(replyBubble);

} catch (err) {
  console.error(err);
  botTyping.outerHTML = `<div class="message bot-msg">Oops! Something went wrong.</div>`;
}

// This line should be *outside* the try/catch but still within the event handler
chatBox.scrollTop = chatBox.scrollHeight;