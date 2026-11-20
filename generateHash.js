const bcrypt = require("bcrypt");

const generateHash = async () => {
    const password = "AdminRacikRasa123";


    const hashedPassword = await bcrypt.hash(password,10)

 console.log("password hash:",hashedPassword) ;

};

generateHash();