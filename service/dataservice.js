const jwt = require('jsonwebtoken')

const db = require('./db')



// userDetails = {
//   1000: { acno: 1000, username: "anu", password: "abc123", balance: 0, transaction: [] },
//   1001: { acno: 1001, username: "amal", password: "abc123", balance: 0, transaction: [] },
//   1002: { acno: 1002, username: "arun", password: "abc123", balance: 0, transaction: [] },
//   1003: { acno: 1003, username: "akhil", password: "abc123", balance: 0, transaction: [] }

// }


register = (uname, acno, psw) => {
  return db.User.findOne({ acno }).then(user => {
    if (user) {
      return {
        status: false,
        message: 'user already present',
        statuscode: 402
      }
    }
    else {
      // create new user in database
      const newUser = new db.User({
        acno, username: uname, password: psw, balance: 0, transaction: []
      })
      newUser.save()

      return {
        status: true,
        message: 'register success',
        statuscode: 200
      }
    }
  })
}


login = (acno, psw) => {
 return db.User.findOne({ acno, password: psw }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno

      const token = jwt.sign({ currentAcno }, "supersecretkey123")

      return {
        status: true,
        message: 'login success',
        statusCode: 200,
        currentUser,
        currentAcno,
        token
      }

    }
    else {
      return {
        status: false,
        message: 'incorrect account number or password',
        statusCode: 401
      }

    }

  })

}

deposit = (acnum, password, amount) => {

  var amnt = parseInt(amount)
  return db.User.findOne({ acno:acnum, password }).then(user => {
  if (user) {
      user.balance+=amnt
      user.transaction.push({ Type: "CREDIT", amount: amnt})

      user.save()

      return {
        status: true,
        message: `${amnt} is credited to your account and the balance 
                   ${user.balance}`,
        statusCode: 200
      }

    }
    else {
      return {
        status: false,
        message: 'incorrect account number or password ',
        statusCode: 401
      }
    }
  })
}
  
withdraw = (acnum, password, amount) => {

  var amnt = parseInt(amount)
  return db.User.findOne({ acno:acnum, password }).then(user => {
  if (user) {
      if (amnt <= user.balance) {

        user.balance -= amnt

        user.transaction.push({ Type: "DEBIT", amount: amnt })

        user.save()

        return {
          status: true,
          message: `${amnt} is debited to your account and the balance 
                 ${user.balance}`,
          statusCode: 200
        }
      }
      else {
        return {
          status: false,
          message: 'insufficient balance',
          statusCode: 401
        }
      }
    }
    else {
      return {
        status: false,
        message: 'incorrect acno or password',
        statusCode: 401
      }
    }
  })
}

getTransaction = (acno) => {
  return db.User.findOne({acno}).then(user=> {
    if(user){
      return {
    status: true,
    statusCode: 200,
    transaction: user.transaction
  }
}
})
}

deleteAcc=(acno)=>{
  return db.User.deleteOne({acno}).then(user=>{
    if(user){
      return{
        status: true,
          statusCode: 200,
          message: 'account deleted',
      }
    }
    else{
      return{
        status: false,
        message: 'user not exist',
        statusCode: 401
      }
    }
  })
}



module.exports = {
  register, login, deposit, withdraw, getTransaction,deleteAcc
}

