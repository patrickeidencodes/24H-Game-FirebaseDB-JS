// @ts-nocheck

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore()
//references
const scoreButtond2HTML = document.querySelector('#scoreButton2')
const lb1 = document.querySelector('#lb1')
const lb2 = document.querySelector('#lb2')
const lb3 = document.querySelector('#lb3')
const lb4 = document.querySelector('#lb4')
const lb5 = document.querySelector('#lb5')
const lb6 = document.querySelector('#lb6')
const lb7 = document.querySelector('#lb7')
const lb8 = document.querySelector('#lb8')
const lb9 = document.querySelector('#lb9')
const lb10 = document.querySelector('#lb10')
//load latest data

let names
let scores
let scores2
let indexes
let ids 

async function newScore(){
  var ref = collection(db, "Leaderborad");
  const docRef = await addDoc(
    ref, {
      name: "user",
      score: 0
    }
  ).then(() => {
    console.log("suc")
  })
  .catch((error) => {
    console.log("err")
  })
} 

async function update(user, score){
  console.log("update")
  if (user.length > 0){
    console.log("update")
    console.log(user)
    console.log(score)
    names = []
    scores = []
    ids = []
    let check = false
    var q = query(collection(db, "Leaderborad"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      names.push(doc.data().name)
      scores.push(doc.data().score)
      ids.push(doc.id)
    });
    let minScore = Math.min(...scores)
    let index
    scores.forEach((num,i) =>{
      if (num == minScore) index = i
    })
    let minName = names[index]
    console.log(names)
    console.log(scores)
    console.log(ids)
    console.log(minName)
    const ref = doc(db, "Leaderborad", ids[index]);
    await updateDoc(ref, {
      name: user,
      score: score
    })
    .then(() => {
     audio.win.play()
     entryButtondHTML.style.display = 'none';
     userForm.style.display = 'none';
     scoreButton2dHTML.style.display = 'block'
    })
    .catch((error) => {
      console.log("err")
    })
  }
}

async function getScores(){
  names = []
  scores = []
  scores2 = []
  indexes = []
  var q = query(collection(db, "Leaderborad"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    names.push(doc.data().name)
    scores.push(doc.data().score)
    scores2.push(doc.data().score)
  });
  for (let i = 0; i < 10; i++) {
    let minScore = Math.max(...scores)
    const index = scores.findIndex(score => {
      return score === minScore;
    });
    scores[index] = -10
    indexes.push(index)
  } 
  console.log(indexes)
  console.log(scores2)
  console.log(names)
  lb1.innerHTML = names[indexes[0]].toString()+" , "+scores2[indexes[0]].toString()+" Punkte"
  lb2.innerHTML = names[indexes[1]].toString()+" , "+scores2[indexes[1]].toString()+" Punkte"
  lb3.innerHTML = names[indexes[2]].toString()+" , "+scores2[indexes[2]].toString()+" Punkte"
  lb4.innerHTML = names[indexes[3]].toString()+" , "+scores2[indexes[3]].toString()+" Punkte"
  lb5.innerHTML = names[indexes[4]].toString()+" , "+scores2[indexes[4]].toString()+" Punkte"
  lb6.innerHTML = names[indexes[5]].toString()+" , "+scores2[indexes[5]].toString()+" Punkte"
  lb7.innerHTML = names[indexes[6]].toString()+" , "+scores2[indexes[6]].toString()+" Punkte"
  lb8.innerHTML = names[indexes[7]].toString()+" , "+scores2[indexes[7]].toString()+" Punkte"
  lb9.innerHTML = names[indexes[8]].toString()+" , "+scores2[indexes[8]].toString()+" Punkte"
  lb10.innerHTML = names[indexes[9]].toString()+" , "+scores2[indexes[9]].toString()+" Punkte"
  lb1.style.textAlign = 'center'
  lb2.style.textAlign = 'center'
  lb3.style.textAlign = 'center'
  lb4.style.textAlign = 'center'
  lb5.style.textAlign = 'center'
  lb6.style.textAlign = 'center'
  lb7.style.textAlign = 'center'
  lb8.style.textAlign = 'center'
  lb9.style.textAlign = 'center'
  lb10.style.textAlign = 'center'
  lb1.style.padding = '10px'
  lb2.style.padding = '10px'
  lb3.style.padding = '10px'
  lb4.style.padding = '10px'
  lb5.style.padding = '10px'
  lb6.style.padding = '10px'
  lb7.style.padding = '10px'
  lb8.style.padding = '10px'
  lb9.style.padding = '10px'
  lb10.style.padding = '10px'
}

scoreButtondHTML.addEventListener('click', ()=>{
  getScores().then(()=> {
    leaderboardHTML.style.display = 'block'
    startStyleHTML.style.display = 'none'
  })
})

scoreButtond2HTML.addEventListener('click', ()=>{
  getScores().then(()=> {
    leaderboardHTML.style.display = 'block'
    gameOverHTML.style.display = 'none'
  })
})

entryButtondHTML.addEventListener('click', ()=>{
  update(userForm.value, globalScore).then(()=> {
    console.log("nice job duuuude")
  })
})