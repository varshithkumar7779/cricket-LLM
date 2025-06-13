const mongoose=require('mongoose')
/*mongoose.connect("mongodb+srv://varshithkumar:varshithkumar@cluster0.0s05k7u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
*/mongoose.connect("mongodb+srv://varshithkumar:varshithkumar@cluster0.0s05k7u.mongodb.net/")
.then(()=>{
    console.log('mongodb connected')
})
.catch((error)=>{
    console.error('MongoDB connection failed:', error);
});

const newSchema1 = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    list: [{
      question: {
        type: String,
        required: true
      },
      response: {
        type: String,
        required: true
      }
    }]
  });

  const newSchema2 = new mongoose.Schema({
    email: {
      type: String,
      required: true
    },
      chatdata: {
        type: String,
        required: true
      }
  });
const cricket1=mongoose.model('cricket1',newSchema1)
const cricket2=mongoose.model('cricket2',newSchema2)
module.exports={cricket1,cricket2}
//export default {collection,collection_1};