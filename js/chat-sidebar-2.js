class ChatSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;
  }

  // Observe both 'open' and 'is-fullscreen'
  static get observedAttributes() {
    return ["open", "is-fullscreen"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "open") {
      this.toggleChat(newValue === "true");
    } else if (name === "is-fullscreen") {
      // Toggle fullscreen mode by adding/removing a class on the host
      if (newValue === "true") {
        this.classList.add("in-fullscreen");
      } else {
        this.classList.remove("in-fullscreen");
      }
    }
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    // Initialize state based on attributes
    const initialOpen = this.getAttribute("open") === "true";
    this.toggleChat(initialOpen);
    // Set initial fullscreen state if attribute exists
    if (this.getAttribute("is-fullscreen") === "true") {
      this.classList.add("in-fullscreen");
    }
  }

  toggleChat(open) {
    this.isOpen = open;
    const chatSidebar = this.shadowRoot.querySelector(".chat-sidebar");

    if (!chatSidebar) return;

    if (open) {
      if (this.getAttribute("is-fullscreen") === "true") {
        chatSidebar.style.right = "0";
      } else {
        chatSidebar.style.position = "relative";
        chatSidebar.style.right = "auto";
        chatSidebar.style.width = "100%";
      }
    } else {
      chatSidebar.style.right = "-350px";
      chatSidebar.style.position = "fixed";
      chatSidebar.style.width = "350px";
    }

    // Dispatch an event when state changes
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
          height: 100vh;
          height: -webkit-fill-available;
      }

      @supports (-webkit-touch-callout: none) {
          :host {
              height: -webkit-fill-available;
          }
      }

      .chat-sidebar {
          position: fixed;
          top: 0;
          right: -350px;
          width: 350px;
          height: 100vh;
          height: -webkit-fill-available;
          max-height: 100vh;
          max-height: -webkit-fill-available;
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
          transition: right 0.3s ease, background-color 0.3s ease;
          display: flex;
          flex-direction: column;
      }

      @supports (-webkit-touch-callout: none) {
          .chat-sidebar {
              height: -webkit-fill-available;
              min-height: -webkit-fill-available;
              max-height: -webkit-fill-available;
          }
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

      /* Make chat transparent when in fullscreen mode */
      :host(.in-fullscreen) .chat-sidebar {
          background-color: rgba(0, 0, 0, 0.1);
          box-shadow: none;
          backdrop-filter: none; /* Ensure no blur effect */
      }

      :host(.in-fullscreen) .chat-header {
          background-color: rgba(0, 0, 0, 0.1);
      }

      :host(.in-fullscreen) .message.received {
          background-color: rgba(255, 255, 255, 0.9);
      }

      :host(.in-fullscreen) .message.sent {
          background-color: rgba(0, 0, 0, 0.1);
      }

      :host(.in-fullscreen) .chat-input {
          background-color: rgba(0, 0, 0, 0.1);
      }

      /* Apply transparent styles to normal mode as well */
      :host .chat-sidebar {
          background-color: rgba(0, 0, 0, 0.1);
          box-shadow: none;
          backdrop-filter: none; /* Ensure no blur effect */
      }

      :host .chat-header {
          background-color: rgba(0, 0, 0, 0.1);
      }

      :host .message.received {
          background-color: rgba(255, 255, 255, 0.9);
      }

      :host .message.sent {
          background-color: rgba(255, 255, 255, 0.5);
          color: #000;
      }

      :host .chat-input {
          background-color: rgba(0, 0, 0, 0.1);
      }

      /* Fullscreen specific styles */
      :host-context(.fullscreen) .chat-sidebar {
          background-color: rgba(0, 0, 0, 0.1);
          backdrop-filter: none; /* Ensure no blur effect */
      }

      :host-context(.fullscreen) .chat-header {
          background-color: rgba(0, 123, 255, 0.8);
      }

      :host-context(.fullscreen) .message.received {
          background-color: rgba(233, 236, 239, 0.9);
      }

      :host-context(.fullscreen) .message.sent {
          background-color: rgba(233, 236, 239, 0.6);
      }

      :host-context(.fullscreen) .chat-input {
          border-top: 1px solid rgba(222, 226, 230, 0.3);
          background-color: rgba(255, 255, 255, 0.1);
      }

      :host-context(.fullscreen) .chat-input input {
          background-color: rgba(255, 255, 255, 0.9);
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

    // Combine style and HTML so that styles are not overwritten.
    this.shadowRoot.innerHTML = `<style>${styles}</style>${html}`;

    // Set initial state if the "open" attribute exists.
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

        // Simulate a response.
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

    // Close chat when clicking outside.
    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.contains(e.target) && !e.target.matches(".toggle-button")) {
        this.setAttribute("open", "false");
      }
    });
  }
}

customElements.define("chat-sidebar", ChatSidebar);
