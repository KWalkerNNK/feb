// Get cookies
let userId, email, fullName;
const cookies = document.cookie.split(';');
cookies.forEach(function (cookie) {
  const cookieParts = cookie.split('=');
  const key = cookieParts[0].trim();
  switch (key) {
    case 'id':
      userId = cookieParts[1].trim();
      break;
    case 'email':
      email = cookieParts[1].trim();
      break;
    default:
      fullName = decodeURIComponent(cookieParts[1].trim());
  }
});

// Create the post object
const createGroup = (document.getElementById(
  'create-group',
).action = `/group/create/${userId}`);
$('create-group').submit(function (event) {
  event.preventDefault();

  var $form = $(this),
    term = $form.find("input[name='title']").val(),
    url = $form.attr('action');

  var posting = $.post(url, { s: term });
});

// Socket container
const socket = io('http://localhost:80/websocket');
const text = document.getElementById('message');
const messages = document.getElementById('messages');
const firtsElement = document.getElementById('firts-element');
function addSession(s) {
  sessionStorage.setItem('s', s);
}
const conversationId = sessionStorage.getItem('s');
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
              <img src="/img/user.png" alt="avatar"
                class="rounded-circle d-flex align-self-start ms-3 shadow-1-strong" width="60">
            </li>`;
  const otherUser = `
    <li class="d-flex justify-content-between mb-4">
              <a href="/profile/{{this.senderId.id}}"><img src="/img/user.png"
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
