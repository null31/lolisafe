/* global swal, axios */

const page = {
  // user token
  token: localStorage.token,

  // HTML elements
  user: null,
  pass: null
}

page.do = function (dest) {
  const user = page.user.value
  const pass = page.pass.value

  if (!user)
    return swal('An error occurred!', 'You need to specify a username.', 'error')

  if (!pass)
    return swal('An error occurred!', 'You need to specify a password.', 'error')

  axios.post(`api/${dest}`, {
    username: user,
    password: pass
  }).then(function (response) {
    if (response.data.success === false)
      return swal(`Unable to ${dest}!`, response.data.description, 'error')

    localStorage.token = response.data.token
    window.location = 'dashboard'
  }).catch(function (error) {
    console.error(error)
    return swal('An error occurred!', 'There was an error with the request, please check the console for more information.', 'error')
  })
}

page.verify = function () {
  if (!page.token) return

  axios.post('api/tokens/verify', {
    token: page.token
  }).then(function (response) {
    if (response.data.success === false)
      return swal('An error occurred!', response.data.description, 'error')

    window.location = 'dashboard'
  }).catch(function (error) {
    console.log(error)
    const description = error.response.data && error.response.data.description
      ? error.response.data.description
      : 'There was an error with the request, please check the console for more information.'
    return swal(`${error.response.status} ${error.response.statusText}`, description, 'error')
  })
}

window.onload = function () {
  page.verify()

  page.user = document.getElementById('user')
  page.pass = document.getElementById('pass')

  // Prevent default form's submit action
  document.getElementById('authForm').addEventListener('submit', function (event) {
    event.preventDefault()
  })

  document.getElementById('loginBtn').addEventListener('click', function () {
    page.do('login')
  })

  document.getElementById('registerBtn').addEventListener('click', function () {
    page.do('register')
  })
}
