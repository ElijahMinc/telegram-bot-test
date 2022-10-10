const getInfoUser = (msg) => {
  const {
    from: { first_name, last_name, username },
  } = msg
  return {
    firstName: first_name,
    lastName: last_name,
    userName: username,
  }
}

module.exports = getInfoUser
