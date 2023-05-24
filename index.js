
window.addEventListener('DOMContentLoaded', function() {
  var navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > navbar.offsetHeight) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});

  

  //open login page on button click
  function registerindex(){
    window.location.href = "login.html";
  }




  // Get form input values
  var weight = document.getElementById("weight");
  var targetWeight = document.getElementById("target-weight");
  var timeframe = document.getElementById("timeframe");
  var age=document.getElementById("age");
  var height=document.getElementById("height");
  var activityLevel=document.getElementById("activity-list");
  var genderValue = null; // Initialize genderValue to null
  // Get the radio buttons
  var genderRadios = document.querySelectorAll('input[name="gender"]');  
  // Add event listener to each radio button
  genderRadios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      // Update genderValue with the selected value
      genderValue = document.querySelector('input[name="gender"]:checked').value;
    });
  });



  //macros
  function calculateMacros() {
      
     if(weight.value==="")
    {
      alert("weight cannot be blank");
      return;
    }
     if(targetWeight.value==="")
    {
      alert("target_weight cannot be blank");
      return;
    }

    if(weight.value===targetWeight.value)
    {
      alert("weight and target weight cannot be equal");
      return;
    }

    if(age.value==="")
    {
      alert("Enter valid age");
      return;
    }
    if (height.value === "") {
      alert("Height cannot be blank.");
      return;
    }
    
    const heightValue = parseFloat(height.value);
     
    if (heightValue < 140 || heightValue > 200) {
      alert("Height must be between 140cm and 200cm.");
      return;
    }
    
     if(timeframe.value==="")
    {
      alert("timeframe cannot be blank");
      return;
    }
    if (timeframe.value <= 0) {
      alert("Timeframe must be greater than 0.");
      return;
    }

  if (!genderValue) {
    alert("Please select a gender.");
    return;
  }
  // loop through the gender radio buttons to check if one is selected
  let isSelected = false;
  for (let i = 0; i < genderValue.length; i++) {
    if (genderRadios[i].checked) {
      isSelected = true;
      break;
    }
  }

  var gender=genderValue;
  weight= weight.value;
  targetWeight= targetWeight.value;
  timeframe= timeframe.value;
  age=age.value;
  genderValue=genderValue;
  height=height.value;
  activityLevel=activityLevel.value;

  
      
  // // Calculate macros and display result
  // const calories = (targetWeight - weight) * 3500 / timeframe;
  // const protein = Math.round(targetWeight * 1.5);
  // const carbs = Math.round(calories * 0.5 / 4);



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


  const result = `Calories: ${dailyCalories.toFixed(0)} | Protein: ${proteinGrams.toFixed(0)}g | Carbs: ${carbGrams.toFixed(0)}g| Fats: ${fatGrams.toFixed(0)}g`;
//const resultt = weight+" tg"+targetWeight+"age"+age+"gebder"+gender+"ht"+height+"act"+activityLevel+"tf"+timeframe;
  document.getElementById("macros").innerHTML = result;
 // document.getElementById("mac").innerHTML = resultt;
  

}



//-----------------------------------------------------------------------------------------
//==========================================================================================

function showLoginForm() {
  document.getElementById("register-form").style.display = "none";
  document.getElementById("login-form").style.display = "flex";
}

function showRegisterForm() {
  document.getElementById("register-form").style.display = "flex";
  document.getElementById("login-form").style.display = "none";
}

