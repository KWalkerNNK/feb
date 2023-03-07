let userId, email, fullName;
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
