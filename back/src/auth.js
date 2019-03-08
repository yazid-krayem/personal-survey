const users = [
    { nick:'anna', name:'nina.williams@tek.ken', password:'hapkido' },
    { nick:'shao', name:'johnny.cage@mk.com.bat', password:'hunter2' },
    { nick:'ryu', name:'ken.masters@sf.er', password:'shoryuken' },
    { nick:'a', name:'a', password:'a' }, // this one is for easy testing
  ]
  
  /**
   * this is our logged in users.
   * In this example, `ken` is logged in (we suppose Ken, on the other side, 
   * holds the same token in their browser)
   **/
  const tokens = {
    'test':2
  }
  
  export const authenticateUser = (req, res, next) => {
    if(!req.query.username || !req.query.password){
      return res.status(401).json({
        success:false,
        message:'username and password are both necessary'
      })
    }
    const { username, password } = req.query
    // let's find the user who has both the provided username, and the provided password
    const userIndex = users.findIndex( u => u.password === password && u.name === username)
    if(userIndex < 0 ){
      return res.status(401).json({
        success: false,
        message:'wrong username or password'
      })
    }
    // here, the user has been found, we can create a token and assign it:
    const user = users[userIndex]
    const nick = user.nick
    const token = Math.random()+"" // <-- this is *absolutely* not random enough for production
    tokens[token] = userIndex
    res.json({
      success:true,
      result: {
        nick,
        token
      }
    })
  }
  
  export const logout = (req, res, next) => {
    const token = req.query.token
    if(!token){
      // if there's no token, there's nothing to do
      // we could return an error, but we don't want to disclose
      // information about the internals. We'll return success anyway
      return res.json({ success: true })
    }
    if(typeof tokens[token] === 'undefined'){
      // if the token is not found, there's nothing to do either
      return res.json({ success: true })
    }
    // we remove the token from the object
    delete tokens[token]
    return res.json({ success:true })
  }
  
  export const isLoggedIn = (req, res, next) => {
    const token = req.query.token
    if(!token || (typeof tokens[token] === 'undefined')){
      return res.status(403).json({ success: false, message: 'forbidden' })
    }
    const userIndex = tokens[token]
    const user = users[userIndex]
    req.is_logged_in = true
    req.user = user // we set this on `req` so subsequent handlers can check this
    next()
  }
  