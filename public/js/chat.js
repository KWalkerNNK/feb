//Set session when clicked conversation
function addSession(s) {
  sessionStorage.setItem('s', s);
}

var conversationId;

window.onload = function () {
  let s = sessionStorage.getItem('s');
  if (!s) {
    sessionStorage.setItem('s', 1);
    s = 1;
  }
  let link = document.getElementById('add-session');
  if (link) {
    let href = link.getAttribute('href');
    let id = href.split('/').pop();
    if (s && id) {
      addSession(id);
    }
  }
  conversationId = sessionStorage.getItem('s');
};



// Get cookies
let userId, email, fullName;
if (document.cookie.length === 0) {
  window.location.href = '/auth/login';
}
const cookies = document.cookie.split(';');
cookies.forEach(function (cookie) {
  const cookieParts = cookie.split('=');
  const key = cookieParts[0].trim();
  switch (key) {
    case 'id':
      userId = decodeURIComponent(cookieParts[1].trim());
      break;
    case 'email':
      email = decodeURIComponent(cookieParts[1].trim());
      break;
    default:
      fullName = decodeURIComponent(cookieParts[1].trim());
  }
});

// Post | Create Conversation
const conversationList = document.getElementById('conversation-list');
const lastConversationLink = $('ul#conversation-list li:last-child a');
if (lastConversationLink.length > 0) {
  const lastConversationId = parseInt($('ul#conversation-list li:last-child a').attr('onclick').match(/\d+/)[0]);
  const createGroupForm = document.getElementById('create-group');
  createGroupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(createGroupForm);
    const conversationTitle = formData.get('title');
    scrollToActive(conversationList);
    // Call the server-side API to create the conversation
    $.ajax({
      url: `/group/create/${userId}`,
      type: 'POST',
      data: {
        title: conversationTitle,
      },
      success: function (data) {
        // Add the new conversation to the list without reloading the page
        const newConversation = `
        <li class="p-2 border-bottom" style="border-bottom: 1px solid rgba(255,255,255,.3) !important;">
          <a onclick="addSession(${lastConversationId + 1})" href="${lastConversationId + 1}" class="d-flex justify-content-between link-light">
            <div class="d-flex flex-row">
              <img src="/img/group.webp" alt="avatar" class="rounded-circle d-flex align-self-center me-3 shadow-1-strong" width="60">
              <div class="pt-1">
                <p class="fw-bold mb-0">${conversationTitle}</p>
                <p class="small text-white">Let's chat!</p>
              </div>
            </div>
            <div class="pt-1">
              <p class="small text-white mb-1 text-truncate" style="max-width: 180px;">Ngay bây giờ</p>
              <span class="badge bg-danger float-end">1</span>
            </div>
          </a>
        </li>
      `;
        $('#conversation-list').append(newConversation);
      },
      error: function (error) {
        console.log(error);
      }
    });
  });
}
else {
  const createGroup = (document.getElementById(
    'create-group',
  ).action = `/group/create/${userId}`);
  $('create-group').submit(function (event) {
    event.preventDefault();
  });
}

if (window.innerWidth <= 600) {
  const conversationClass = document.querySelector('.conversation');
  const messagesClass = document.querySelector('.messages');

  conversationClass.addEventListener('click', (event) => {
    conversationClass.classList.add('hidden');
    messagesClass.classList.add('visible');
    event.preventDefault();
  });
}

// Socket container
// const socket = io('https://01bc-117-2-155-129.ap.ngrok.io/websocket');
const socket = io('http://localhost:80/websocket');
const text = document.getElementById('message');
const messages = document.getElementById('messages');
const firtsElement = document.getElementById('firts-element');
const submitBtn = document.getElementById('submit-btn');

scrollToActive(messages);

// Catch event when clicked keydown
if (text) {
  text.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmitMessage();
      scrollToActive(messages);
    }
  });

  submitBtn.addEventListener("click", function (event) {
    event.preventDefault();
    handleSubmitMessage();
    scrollToActive(messages);
  });
}

//Scroll to active messages
function scrollToActive(event) {
  setTimeout(() => {
    event.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, 500)
}

const handleSubmitMessage = (conversation, senderId, message, currentFullName) => {
  socket.emit('message', {
    conversation: conversationId,
    senderId: userId,
    message: text.value,
    currentFullName: fullName,
  });
};

socket.on('message', (data) => {
  handleNewMessage(data.message, data.senderId, data.currentFullName);
  cleanMessage(message);
});

const handleNewMessage = (message, senderId, currentFullName) => {
  buildNewMessage(message, senderId, currentFullName);
};

const buildNewMessage = (message, senderId, currentFullName) => {
  const currentUser = `<li class="d-flex justify-content-between mb-4">
              <div class="card mask-custom w-100">
                <div class="card-header d-flex justify-content-between p-3"
                  style="border-bottom: 1px solid rgba(255,255,255,.3);">
                  <p class="fw-bold mb-0">${currentFullName}</p>
                  <p class="text-light small mb-0"><i class="far fa-clock"></i> 1 min ago</p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    ${message}
                  </p>
                </div>
              </div>
              <a href="/profile/${senderId}"><img src="/img/user.png" alt="avatar"
                class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60"></a>
            </li>`;
  const otherUser = `
    <li class="d-flex justify-content-between mb-4">
              <a href="/profile/${senderId}"><img src="/img/user.png"
                  alt="avatar" class="rounded-circle d-flex align-self-start me-3 shadow-1-strong" width="60"></a>
              <div class="card mask-custom w-100">
                <div class="card-header d-flex justify-content-between p-3"
                  style="border-bottom: 1px solid rgba(255,255,255,.3);">
                  <p class="fw-bold mb-0">${currentFullName}</p>
                  <p class="text-light small mb-0"><i class="far fa-clock"></i>Ngay bây giờ</p>
                </div>
                <div class="card-body">
                  <p class="mb-0">
                    ${message}
                  </p>
                </div>
              </div>
            </li>
    `;
  return firtsElement.insertAdjacentHTML(
    'beforeend',
    userId == senderId ? currentUser : otherUser,
  );
};

const cleanMessage = (message) => {
  return (message.value = '');
};
