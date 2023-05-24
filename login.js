    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
    import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";


    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
  
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAjE4FdweXzIAB-k0LY1meXdyv9VmfmXm0",
      authDomain: "fitnessx-8e353.firebaseapp.com",
      projectId: "fitnessx-8e353",
      storageBucket: "fitnessx-8e353.appspot.com",
      messagingSenderId: "767560401693",
      appId: "1:767560401693:web:b99d5233d62a0a514c57f4",
      databaseURL:"https://fitnessx-8e353-default-rtdb.firebaseio.com/"
    };


  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth=getAuth()
    const db = getDatabase();

    var fullname=document.getElementById("full_name")
    var email=document.getElementById("email")
    var password=document.getElementById("password")
    var cpassword=document.getElementById("cpassword")
    var age=document.getElementById("age")
    var weight=document.getElementById("weight")
    var target_weight=document.getElementById("target-weight")
    var height=document.getElementById("height")
    var activity=document.getElementById("activity-list")
    var timeframe=document.getElementById("timeframe")
    var email_login=document.getElementById("login-email")
    var password_login=document.getElementById("login-password")   
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
    


// Define a function to reset the values of the input fields
function resetForm() {
    fullname.value = "";
    email.value = "";
    weight.value = "";
    target_weight.value = "";
    timeframe.value = "";
    password.value = "";
    cpassword.value = "";
    age.value = "";
    height.value = "";
      }
  



//=================================Register Function==================================================
window.register=function(e){
        e.preventDefault();

  
        var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g; //Javascript reGex for Email Validation.
		    var regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;

          // Show the progress bar
          var progressBar = document.getElementById("progress-bar");
          progressBar.classList.add("show");
  

        //validations part
 
         if(fullname.value=== '')
        {
          alert("fullname cannot be blank");
          return;
        }
         if(email.value==="")
        {
          alert("email cannot be blank");
          return;
        }
        if(!regEmail.test(email.value)){
          alert("enter valid email");
          return;
        }
        if(password.value==="")
        {
          alert("password cannot be blank");
          return;
        }
        if(!regPass.test(password.value)){
          alert("Password should contain At least one digit"
          +"At least one lowercase letter"
          +" At least one uppercase letter"
          +"At least one special character"
          +"No whitespace allowed"
          +"Minimum length of 6 characters"
          +"Maximum length of 20 characters");
          return;
        }
         if(cpassword.value==="")
        {
          alert("confirm password cannot be blank");
          return;
        }
        if (password.value !== cpassword.value) {
          alert("Passwords do not match");
          return;
        }
         if(age.value==="")
        {
          alert("Enter valid age");
          return;
        }
         if(weight.value==="")
        {
          alert("weight cannot be blank");
          return;
        }
         if(target_weight.value==="")
        {
          alert("target_weight cannot be blank");
          return;
        }
        if(weight.value===target_weight.value)
        {
          alert("current weight and target weight cannot be equal");
          return;
        }
       
         if(height.value==="")
        {
          alert("height cannot be blank");
          return;
        }

        if (height.value === "") {
          alert("Height cannot be blank.");
          return;
        }
        
        const heightValue = parseFloat(height.value);
        if (isNaN(heightValue)) {
          alert("Please enter a valid number for height.");
          return;
        }
        
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


          //================================ADD USER TO DATABASE============================================
        createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          // Signed in 
          alert("Registered")
         // Hide the progress bar on success
      progressBar.classList.remove("show");
    
          var user = userCredential.user;
          console.log("User created:", user.uid);
          // Save user data to database
          var userData = {
            fullname: fullname.value,
            email: email.value,
            weight: weight.value,
            target_weight: target_weight.value,
            timeframe: timeframe.value,
            age:age.value,
            genderValue:genderValue,
            height:height.value,
            activity:activity.value
          };
          set(ref(db, "users/" + user.uid), userData)
            .then(() => {
              console.log("User data saved to database"+user.id+"user data"+userData);
              // Redirect to main.html after data is saved
             // window.location.href = "main.html";

             resetForm();

             var successMessage = document.getElementById("success-message");
             successMessage.innerHTML = "Registered successfully. Please log in.";
             document.getElementById("register-form").style.display = "none";
             document.getElementById("login-form").style.display = "flex";

            })
            .catch((error) => {
              console.log("Error saving user data:", error.message);
              alert("Error creating user:"+errorMessage);
            });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log("Error creating user:", errorMessage);
          alert("Error creating user:"+errorMessage);
        });
    };
  
    //Register function ends here--------------------------------------

    //Login function

// Login function
window.login = function(e) {
    e.preventDefault();
    if(email_login.value==="")
    {
      alert("Email cannot be blank");
      return;
    }
    else if(password_login.value==="")
    {
      alert("Password cannot be blank");
      return;
    }
    // Show the progress bar
    var progressBar = document.getElementById("progress-bar");
    progressBar.classList.add("show");
  
    signInWithEmailAndPassword(auth, email_login.value, password_login.value)
      .then((userCredential) => {
        // Signed in
        alert("Logged in")
        // Hide the progress bar on success
        progressBar.classList.remove("show");
  
        var user = userCredential.user;
        console.log("User logged in:", user.uid);
        // Store user information in session storage
       sessionStorage.setItem('currentUser', JSON.stringify(user));

        // Redirect to main.html after successful login
        window.location.href = "main.html";
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Error logging in:", errorMessage);
        alert("Login Failed"+errorMessage);
      });
  };

  //login ends here====================================================
