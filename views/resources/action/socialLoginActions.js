async function githubLogin() {
  let githubCode = JSON.parse(localStorage.getItem('githubCode'));
  if (githubCode) {
    localStorage.removeItem('githubCode');
    const url = window.location.href;
    const hasCode = url.includes('?code=');
    if (hasCode) {
      const newUrl = url.split('?code=');
      let obj = {
        client_id: document.getElementById('github_client_id').innerHTML,
        client_secret: document.getElementById('github_client_secret').innerHTML,
        code: newUrl[1],
        redirect_uri: githubCode.url,
      };
      try {
        let response = await axios.post('/login', {
          provider: 'Github',
          cred: obj,
          userName: 'xyz',
          password: 'xyz',
        });
        let loggedInUser = response.data || {};
        if (response.status === 200) {
          await handlePageRedirection(loggedInUser, githubCode.redirectPage);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
}

async function linkedinLogin() {
  let linkedInCode = getUrlParameter('auth');
  if (linkedInCode && linkedInCode === 'LINKEDIN') {
    let redirect_uri = localStorage.getItem('li-redirect-url');
    let userId = getUrlParameter('userId');
    if (userId && redirect_uri) {
      localStorage.removeItem('li-redirect-url');
      let user = { provider: 'Linkedin', status: 'connected', userRoles: '' };
      user.name = getUrlParameter('name');
      user.image = '/';
      user.userName = getUrlParameter('userName');
      user.password = userId;
      user.authResponse = 'user';
      await loginIntoApplication(user, redirect_uri);
    }
  }
}
setTimeout(() => {
  githubLogin();
}, 1000);

setTimeout(() => {
  linkedinLogin();
}, 100);

const socialLoginSignup = async (args) => {
  console.log('args:', args);
  if (!args) args = { parameters: {} };
  const { provider, redirectUrl, userRole } = args.parameters;
  if (provider === 'Facebook') {
    loginUsingFacebook(userRole, redirectUrl);
  }
  if (provider === 'Google') {
    loginUsingGoogle(userRole, redirectUrl);
  }
  if (provider === 'Github') {
    let client_id = document.getElementById('github_client_id').innerHTML;
    localStorage.setItem('githubCode', JSON.stringify({ url: window.location.href, redirectUrl }));
    window.location = `https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${window.location.href}`;
  }
  if (provider === 'LinkedIn') {
    let client_id = btoa(document.getElementById('linkedin_client_id').innerHTML);
    let client_secret = btoa(document.getElementById('linkedin_client_secret').innerHTML);
    localStorage.setItem('li-redirect-url', redirectUrl);
    window.location = `/auth/linkedin/callback?client_id=${client_id}&client_secret=${client_secret}&redirect_uri=${redirectUrl}`;
  }
};

function getUrlParameter(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  var results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const loginUsingFacebook = (userRole, redirectUrl) => {
  FB.login(
    function (response) {
      FB.getLoginStatus(function (response) {
        statusChangeCallback(response, userRole, redirectUrl);
      });
    },
    { scope: 'public_profile, email' },
  );
};

const loginUsingGoogle = (userRole, redirectUrl) => {
  gapi.load('auth2', function () {
    let auth = gapi.auth2.getAuthInstance();
    auth.signIn().then(
      function (googleUser) {
        let profile = googleUser.getBasicProfile();
        let user = {
          provider: 'Google',
          status: 'connected',
          userRoles: userRole,
        };
        user.name = profile.getName();
        user.image = profile.getImageUrl();
        user.userName = profile.getEmail();
        user.password = auth.currentUser.get().getAuthResponse().access_token || profile.getId();
        user.authResponse = googleUser;
        loginIntoApplication(
          user,
          redirectUrl,
          null,
          userRole ? [{ role: userRole, page: redirectUrl }] : null,
        );
      },
      function (error) {
        console.log('user failed to sign in', error);
        // statusChangeCallback({}, userRole, redirectUrl);
      },
    );
  });
};

function statusChangeCallback(response, userRole, redirectUrl) {
  if (response.status === 'connected') {
    // Logged into your app and Facebook.

    sendUserData(userRole, redirectUrl);

    if (localStorage.getItem('app_social_uid') === '') {
      // Send the user data to the server.
      // App.sendUserData();
    }
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    // fbStatus.innerHTML = 'Please log into this app.';
    // greet.innerHTML = '';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    // fbLogin.style.display = 'inline';
    // fbLogout.style.display = 'none';
    // greet.innerHTML = '';
    // fbStatus.innerHTML = 'Login Using';
  }
}

const sendUserData = function (userRole, redirectUrl) {
  FB.api(
    '/me',
    { locale: 'en_US', fields: 'id,name,email,link,gender,locale,picture' },
    async function (data) {
      data['authResponse'] = FB.getAuthResponse();
      const { accessToken } = data.authResponse;
      data['provider'] = 'Facebook';
      data['status'] = 'connected';
      data['userName'] = data['email'];
      data['password'] = accessToken;
      data['userRoles'] = userRole;
      await loginIntoApplication(
        data,
        redirectUrl,
        null,
        userRole ? [{ role: userRole, page: redirectUrl }] : null,
      );
      // Store user id for invalidating session later
      // localStorage.setItem('app_social_uid', data['id']);
    },
  );
};
