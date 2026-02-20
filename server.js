const app = require('./app')

const Port = process.env.PORT || 5050
app.listen(5000,()=>{
    console.log(`Server is running on ${Port}`)
})

