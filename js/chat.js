class ChatSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      this.toggleChat(newValue === "true");
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Initialize state based on attribute
    const initialOpen = this.getAttribute("open") === "true";
    this.toggleChat(initialOpen);
  }

  toggleChat(open) {
    this.isOpen = open;
    const chatSidebar = this.shadowRoot.querySelector(".chat-sidebar");

    if (open) {
      chatSidebar.style.right = "0";
    } else {
      chatSidebar.style.right = "-350px";
    }

    // Dispatch event when state changes
    this.dispatchEvent(
      new CustomEvent("chatToggle", {
        detail: { isOpen: open },
        bubbles: true,
      })
    );
  }

  render() {
    const styles = `
          :host {
              --primary-color: #007bff;
              --hover-color: #0056b3;
              position: fixed;
              top: 0;
              right: 0;
              z-index: 1000;
          }

          .chat-sidebar {
              position: fixed;
              top: 0;
              right: -350px;
              width: 350px;
              height: 100vh;
              background-color: rgba(255, 255, 255, 0.9);
              box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
              transition: right 0.3s ease;
              display: flex;
              flex-direction: column;
          }

          .chat-header {
              padding: 20px;
              background-color: var(--primary-color);
              color: white;
              font-size: 1.2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
          }

          .close-button {
              background: none;
              border: none;
              color: white;
              cursor: pointer;
              padding: 5px;
              font-size: 1.5rem;
              line-height: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 30px;
              height: 30px;
              border-radius: 50%;
              transition: background-color 0.3s;
          }

          .close-button:hover {
              background-color: rgba(255, 255, 255, 0.2);
          }

          .chat-messages {
              flex-grow: 1;
              padding: 20px;
              overflow-y: auto;
          }

          .message {
              margin-bottom: 15px;
              padding: 10px;
              border-radius: 5px;
              max-width: 80%;
          }

          .message.received {
              background-color: #e9ecef;
              margin-right: auto;
          }

          .message.sent {
              background-color: var(--primary-color);
              color: white;
              margin-left: auto;
          }

          .chat-input {
              padding: 20px;
              border-top: 1px solid #dee2e6;
              display: flex;
              gap: 10px;
          }

          .chat-input input {
              flex-grow: 1;
              padding: 10px;
              border: 1px solid #dee2e6;
              border-radius: 5px;
          }

          .chat-input button {
              padding: 10px 20px;
              background-color: var(--primary-color);
              color: white;
              border: none;
              border-radius: 5px;
              cursor: pointer;
          }

          .chat-input button:hover {
              background-color: var(--hover-color);
          }

          /* Ensure visibility in fullscreen */
          :host(:fullscreen) {
              z-index: 9999;
          }
      `;

    const html = `
          <div class="chat-sidebar">
              <div class="chat-header">
                  <span>Chat Messages</span>
                  <button class="close-button">×</button>
              </div>
              <div class="chat-messages">
                  <div class="message received">Hello! How can I help you today?</div>
              </div>
              <div class="chat-input">
                  <input type="text" placeholder="Type your message...">
                  <button>Send</button>
              </div>
          </div>
      `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;

    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(styleSheet);
    this.shadowRoot.innerHTML += html;

    // Set initial state if open attribute exists
    const initialState = this.getAttribute("open");
    if (initialState) {
      this.toggleChat(initialState === "true");
    }
  }

  setupEventListeners() {
    const closeButton = this.shadowRoot.querySelector(".close-button");
    const chatInput = this.shadowRoot.querySelector(".chat-input input");
    const sendButton = this.shadowRoot.querySelector(".chat-input button");
    const chatMessages = this.shadowRoot.querySelector(".chat-messages");

    closeButton.addEventListener("click", () => {
      this.setAttribute("open", "false");
    });

    const addMessage = (message, isSent) => {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.classList.add(isSent ? "sent" : "received");
      messageDiv.textContent = message;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendButton.addEventListener("click", () => {
      const message = chatInput.value.trim();
      if (message) {
        addMessage(message, true);
        chatInput.value = "";

        // Simulate response
        setTimeout(() => {
          addMessage("Thanks for your message! This is a demo response.", false);
        }, 1000);
      }
    });

    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendButton.click();
      }
    });
  }
}

customElements.define("chat-sidebar", ChatSidebar);
