
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
   import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
   import { getDatabase, ref, set,get } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";


   // TODO: Add SDKs for Firebase products that you want to use
   // https://firebase.google.com/docs/web/setup#available-libraries
 
   // Your web app's Firebase configuration
   const firebaseConfig = {
    apiKey: "AIzaSyCkKcN7I56QhkYtseaXA_D6Bi9hpZmYYqA",
    authDomain: "fitnessx-45d3c.firebaseapp.com",
    projectId: "fitnessx-45d3c",
    storageBucket: "fitnessx-45d3c.appspot.com",
    messagingSenderId: "440920657375",
    appId: "1:440920657375:web:fcf3c7d8b38e670be5086a",
    databaseURL:"https://fitnessx-45d3c-default-rtdb.firebaseio.com/"
  };


 
   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const auth=getAuth()
   const db = getDatabase();
  
  var currentuser = null;
  //display login data in main.html
  currentuser = JSON.parse(sessionStorage.getItem('currentUser'));

  // Get a reference to the logged-in user's data in the database
var userRef = ref(db, "users/" + currentuser.uid);

// Retrieve the user data from the database
get(userRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      var userData = snapshot.val();

// Store the user data in variables
var fullname = userData.fullname;
var email = userData.email;
var weight = userData.weight;
var targetWeight = userData.target_weight;
var timeframe = userData.timeframe;
var age=userData.age;
var height=userData.height;
var gender=userData.genderValue;
var activityLevel=userData.activity;

// Calculate BMR based on gender
let bmr;
if (gender === 'male') {
  bmr = 10 * weight + 6.25 * height - 5 * age + 5;
} else if (gender === 'female') {
  bmr = 10 * weight + 6.25 * height - 5 * age - 161;
}

// Calculate TDEE based on activity level
let tdee;
switch (activityLevel) {
  case 1:
    tdee = bmr * 1.2;
    break;
  case 2:
    tdee = bmr * 1.375;
    break;
  case 3:
    tdee = bmr * 1.55;
    break;
  case 4:
    tdee = bmr * 1.725;
    break;
  case 5:
    tdee = bmr * 1.9;
    break;
  default:
    tdee = bmr * 1.2;
}

// Calculate daily calorie intake for weight gain or loss to reach the target weight
let dailyCalories;
if (targetWeight > weight) {
  // Weight gain
  const weeklyGain = 0.45; // in kg per week
  const weeklyCalories = weeklyGain * 7700; // 7700 calories per kg of body fat
  dailyCalories = tdee + (weeklyCalories / 7);
} else if (targetWeight < weight) {
  // Weight loss
  const weeklyLoss = 0.45; // in kg per week
  const weeklyCalories = weeklyLoss * 7700; // 7700 calories per kg of body fat
  dailyCalories = tdee - (weeklyCalories / 7);
} else {
  // Maintain weight
  dailyCalories = tdee;
}

// Calculate macronutrient ratios
const carbRatio = 0.5;
const proteinRatio = 0.3;
const fatRatio = 0.2;

// Calculate daily macronutrient intake
const carbCalories = dailyCalories * carbRatio;
const carbGrams = carbCalories / 4; // 4 calories per gram of carbohydrates
const proteinCalories = dailyCalories * proteinRatio;
const proteinGrams = proteinCalories / 4; // 4 calories per gram of protein
const fatCalories = dailyCalories * fatRatio;
const fatGrams = fatCalories / 9; // 9 calories per gram of fat

// Output daily calorie intake and macronutrient ratios
console.log(`Daily calorie intake: ${dailyCalories.toFixed(0)} calories`);
console.log(`Carbohydrate intake: ${carbGrams.toFixed(0)} grams`);
console.log(`Protein intake: ${proteinGrams.toFixed(0)} grams`);
console.log(`Fat intake: ${fatGrams.toFixed(0)} grams`);


var actname="";
if(activityLevel==1)
{
  actname="Sedentary (little or no exercise)";
}
else if(activityLevel==2)
{
  actname="Lightly active (light exercise/sports 1-3 days/week)"
}
else if(activityLevel==3)
{actname="Moderately active (moderate exercise/sports 3-5 days/week)"}
else if(activityLevel==4)
{actname="Very active (hard exercise/sports 6-7 days a week)"}
else if(activityLevel==5)
{actname="Extra active (very hard exercise/sports & physical job or 2x training)"}

  // Display the user data on the page
  document.getElementById("fullname").innerText = fullname;
  document.getElementById("email").innerText = email;
  document.getElementById("weight").innerText = weight;
  document.getElementById("target_weight").innerText = targetWeight;
  document.getElementById("timeframe").innerText = timeframe;
  document.getElementById("fullname1").innerText = fullname;
  document.getElementById("age").innerText = age;
  document.getElementById("height").innerText = height;
  document.getElementById("gender").innerText = gender;
  document.getElementById("activity").innerText = actname;
  document.getElementById("calories").innerText = ` ${dailyCalories.toFixed(0)} calories`;
  document.getElementById("carbs").innerText = ` ${carbGrams.toFixed(0)} grams`;
  document.getElementById("protein").innerText = ` ${proteinGrams.toFixed(0)} grams`;
  document.getElementById("fats").innerText = ` ${fatGrams.toFixed(0)} grams`;
  //===========================Chart Start======================================

// Get the user's creation time from Firebase Auth
const creationTime = auth.currentUser.metadata.creationTime;

// Convert the creation time string to a Date object
const creationDate = new Date(creationTime);

// Calculate the number of days since the creation date
const oneDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
const today = new Date();
const daysSinceCreation = Math.floor((today - creationDate) / oneDay);

// Calculate daily weight change
const dailyWeightChange = (dailyCalories - tdee) / 3500;

const timeframeInDays = timeframe; // Example: timeframe entered by user is 30 days
const endDay = new Date(creationDate.getTime() + (timeframeInDays * oneDay)); // End day of the timeframe
const weightArray = [];
let currentWeight = Number(weight);

for (let i = 1; i <= timeframeInDays; i++) {
  currentWeight += dailyWeightChange;
 // currentWeight=currentWeight;
  weightArray.push(currentWeight.toFixed(2));

  const date = new Date(creationDate.getTime() + (i * oneDay));
  if (date > endDay) {
    break; // Stop adding weights to the array after the end day of the timeframe
  }
}

// Add labels to the chart data
const chartData = {
  labels: [],
  datasets: [{
    label: 'Weight',
    data: weightArray,
    lineTension: 0,
    backgroundColor: 'rgba(88, 88, 88, 0.2)',
    borderColor: 'rgba(57, 57, 57, 0.809)',
    borderWidth: 1
  }]
};


// Find the index of the weight for today's date in the weightArray
const weightIndex = today.getTime() - creationDate.getTime();
const weightIndexInDays = Math.floor(weightIndex / oneDay);

// Create a new background color string with a red highlight for today's date
const backgroundColors = weightArray.map((_, i) => {
  if (i === weightIndexInDays) {
    return 'rgba(255, 0, 0, 0.5)';
  } else {
    return 'rgba(88, 88, 88, 0.2)';
  }
});

// Update the dataset with the new background color string
chartData.datasets[0].backgroundColor = backgroundColors;
for (let i = 0; i <= timeframeInDays; i++) {
  const date = new Date(creationDate.getTime() + (i * oneDay));
  if (date > endDay) {
    break; // Stop adding labels to the chart after the end day of the timeframe
  }
  chartData.labels.push(`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`);
}

// Create the chart with the data
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false,
          precision: 2,
          formatter: function(value) {
            return value.toFixed(2);
          }
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        font: {
          size: 14,
          weight: 'bold'
        },
        formatter: function(value) {
          return Number(value).toFixed(1);
        }
      }
    }
  }
});

console.log(chartData);
// Update chart every day
setInterval(() => {
  currentWeight += dailyWeightChange;
  weightArray.push(currentWeight);
  const date = new Date(chartData.labels[chartData.labels.length - 1]);
  const nextDay = new Date(date.getTime() + oneDay);
  if (nextDay > endDay) {
    return; // Stop updating the chart after the end day of the timeframe
  }
  chartData.labels.push(`${nextDay.getDate()}/${nextDay.getMonth() + 1}/${nextDay.getFullYear()}`);
  chartData.datasets[0].data = weightArray.map(w => w.toFixed(1));
  chart.update();
}, oneDay);


//===========================Chart End======================================

    } else {
      console.log("No user data available");
    }
  })
  .catch((error) => {
    console.log("Error retrieving user data:", error.message);
  });



  const openProfileBtn = document.getElementById('open-profile');
const closeProfileBtn = document.getElementById('close-profile');
const profileNav = document.getElementById('profile-nav');

openProfileBtn.addEventListener('click', () => {
  profileNav.classList.add('open');
});

closeProfileBtn.addEventListener('click', () => {
  profileNav.classList.remove('open');
});




  window.logout = function(e) {
    e.preventDefault();
    // your logout code here
    signOut(auth).then(() => {
      // Sign-out successful.
      window.location.replace("index.html");
      currentuser=null;
      alert("logged out successfully")
    }).catch((error) => {
      // An error happened.
      console.log(error.message);
    });
  }


  window.editField = function(e, field) {
    e.preventDefault();
    var fieldElement = document.getElementById(field);
    var originalValue = fieldElement.innerHTML.trim(); // Store the original value of the field
  
    // Replace the field contents with a contenteditable element to allow editing
    fieldElement.innerHTML = `<span contenteditable>${originalValue}</span>`;
    var editableElement = fieldElement.querySelector('[contenteditable]');
  
    // Add an event listener to the editable element to capture the edited value and save it to Firebase
    editableElement.addEventListener('blur', function() {
      var newValue = editableElement.innerText.trim();
      fieldElement.innerHTML = newValue; // Replace the editable element with the new field value
      if (newValue !== originalValue) { // Check if the value was actually changed
        saveDataToFirebase(field, newValue); // Save the new value to Firebase
      }
    });
  
    // Add an event listener to the editable element to capture the Enter key press
    editableElement.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        editableElement.blur(); // Trigger the blur event to save the edited value
      }
    });
  
    // Focus the editable element and select its contents to make it easier to edit
    editableElement.focus();
    var range = document.createRange();
    range.selectNodeContents(editableElement);
    var selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };
  
  



window.editFieldActivity = function(event, field) {
    // Prevent the default behavior of the click event on the field
    event.preventDefault();
  
    // Get the activity field element
    const activityField = document.getElementById(field);
  
    // Create a select element with the desired options
    const selectElement = document.createElement('select');
    selectElement.innerHTML = `
      <option value="1">Sedentary (little or no exercise)</option>
      <option value="2">Lightly active (light exercise/sports 1-3 days/week)</option>
      <option value="3">Moderately active (moderate exercise/sports 3-5 days/week)</option>
      <option value="4">Very active (hard exercise/sports 6-7 days a week)</option>
      <option value="5">Extra active (very hard exercise/sports & physical job or 2x training)</option>
    `;
  
    // Set the current value of the activity field as the selected option in the select element
    selectElement.value = activityField.innerText.trim();
  
    // Replace the activity field with the select element
    activityField.replaceWith(selectElement);
  
    // Add an event listener to the select element to capture the selected value and update the database
    selectElement.addEventListener('change', (event) => {
      const newValue = event.target.value;
      saveDataToFirebase(field, newValue);
    });
  }
  





  function saveDataToFirebase(field, newValue) {
  const userId = auth.currentUser.uid; // Get the current user's ID
  const fieldRef = ref(db, `users/${userId}/${field}`); // Get a reference to the field in the logged-in user's data in the database
set(fieldRef, newValue)
  .then(() => {
    console.log("Data saved successfully!");
    location.reload(); // Refresh the page after the value is saved
  })
  .catch((error) => {
    console.error("Error saving data: ", error);
  });
  
  }
  