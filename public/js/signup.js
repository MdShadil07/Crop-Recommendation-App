// ====================== signup.js (Updated with debug logs & fixed OTP) ======================
console.log("✅ Signup JS Loaded");

// ====================== Global Variables ======================
let selectedUserType = $("input[name='signupUserType']:checked").val() || "farmer";
let currentStep = 1;
let otpSessionId = null;
let otpVerified = false;
let signupInProgress = false;


const stateDistrictData = {
  "andhra-pradesh": {
    name: "Andhra Pradesh",
    districts: [
      "Anantapur",
      "Chittoor",
      "East Godavari",
      "Guntur",
      "Krishna",
      "Kurnool",
      "Prakasam",
      "Nellore",
      "Srikakulam",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
      "YSR Kadapa",
    ],
  },
  bihar: {
    name: "Bihar",
    districts: [
      "Araria",
      "Arwal",
      "Aurangabad",
      "Banka",
      "Begusarai",
      "Bhagalpur",
      "Bhojpur",
      "Buxar",
      "Darbhanga",
      "East Champaran",
      "Gaya",
      "Gopalganj",
      "Jamui",
      "Jehanabad",
      "Kaimur",
      "Katihar",
      "Khagaria",
      "Kishanganj",
      "Lakhisarai",
      "Madhepura",
      "Madhubani",
      "Munger",
      "Muzaffarpur",
      "Nalanda",
      "Nawada",
      "Patna",
      "Purnia",
      "Rohtas",
      "Saharsa",
      "Samastipur",
      "Saran",
      "Sheikhpura",
      "Sheohar",
      "Sitamarhi",
      "Siwan",
      "Supaul",
      "Vaishali",
      "West Champaran",
    ],
  },
  gujarat: {
    name: "Gujarat",
    districts: [
      "Ahmedabad",
      "Amreli",
      "Anand",
      "Aravalli",
      "Banaskantha",
      "Bharuch",
      "Bhavnagar",
      "Botad",
      "Chhota Udepur",
      "Dahod",
      "Dang",
      "Devbhoomi Dwarka",
      "Gandhinagar",
      "Gir Somnath",
      "Jamnagar",
      "Junagadh",
      "Kachchh",
      "Kheda",
      "Mahisagar",
      "Mehsana",
      "Morbi",
      "Narmada",
      "Navsari",
      "Panchmahal",
      "Patan",
      "Porbandar",
      "Rajkot",
      "Sabarkantha",
      "Surat",
      "Surendranagar",
      "Tapi",
      "Vadodara",
      "Valsad",
    ],
  },
  haryana: {
    name: "Haryana",
    districts: [
      "Ambala",
      "Bhiwani",
      "Charkhi Dadri",
      "Faridabad",
      "Fatehabad",
      "Gurugram",
      "Hisar",
      "Jhajjar",
      "Jind",
      "Kaithal",
      "Karnal",
      "Kurukshetra",
      "Mahendragarh",
      "Nuh",
      "Palwal",
      "Panchkula",
      "Panipat",
      "Rewari",
      "Rohtak",
      "Sirsa",
      "Sonipat",
      "Yamunanagar",
    ],
  },
  karnataka: {
    name: "Karnataka",
    districts: [
      "Bagalkot",
      "Ballari",
      "Belagavi",
      "Bengaluru Rural",
      "Bengaluru Urban",
      "Bidar",
      "Chamarajanagar",
      "Chikballapur",
      "Chikkamagaluru",
      "Chitradurga",
      "Dakshina Kannada",
      "Davangere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kalaburagi",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Raichur",
      "Ramanagara",
      "Shivamogga",
      "Tumakuru",
      "Udupi",
      "Uttara Kannada",
      "Vijayapura",
      "Yadgir",
    ],
  },
  "madhya-pradesh": {
    name: "Madhya Pradesh",
    districts: [
      "Agar Malwa",
      "Alirajpur",
      "Anuppur",
      "Ashoknagar",
      "Balaghat",
      "Barwani",
      "Betul",
      "Bhind",
      "Bhopal",
      "Burhanpur",
      "Chhatarpur",
      "Chhindwara",
      "Damoh",
      "Datia",
      "Dewas",
      "Dhar",
      "Dindori",
      "Guna",
      "Gwalior",
      "Harda",
      "Hoshangabad",
      "Indore",
      "Jabalpur",
      "Jhabua",
      "Katni",
      "Khandwa",
      "Khargone",
      "Mandla",
      "Mandsaur",
      "Morena",
      "Narsinghpur",
      "Neemuch",
      "Niwari",
      "Panna",
      "Raisen",
      "Rajgarh",
      "Ratlam",
      "Rewa",
      "Sagar",
      "Satna",
      "Sehore",
      "Seoni",
      "Shahdol",
      "Shajapur",
      "Sheopur",
      "Shivpuri",
      "Sidhi",
      "Singrauli",
      "Tikamgarh",
      "Ujjain",
      "Umaria",
      "Vidisha",
    ],
  },
  maharashtra: {
    name: "Maharashtra",
    districts: [
      "Ahmednagar",
      "Akola",
      "Amravati",
      "Aurangabad",
      "Beed",
      "Bhandara",
      "Buldhana",
      "Chandrapur",
      "Dhule",
      "Gadchiroli",
      "Gondia",
      "Hingoli",
      "Jalgaon",
      "Jalna",
      "Kolhapur",
      "Latur",
      "Mumbai City",
      "Mumbai Suburban",
      "Nagpur",
      "Nanded",
      "Nandurbar",
      "Nashik",
      "Osmanabad",
      "Palghar",
      "Parbhani",
      "Pune",
      "Raigad",
      "Ratnagiri",
      "Sangli",
      "Satara",
      "Sindhudurg",
      "Solapur",
      "Thane",
      "Wardha",
      "Washim",
      "Yavatmal",
    ],
  },
  punjab: {
    name: "Punjab",
    districts: [
      "Amritsar",
      "Barnala",
      "Bathinda",
      "Faridkot",
      "Fatehgarh Sahib",
      "Fazilka",
      "Ferozepur",
      "Gurdaspur",
      "Hoshiarpur",
      "Jalandhar",
      "Kapurthala",
      "Ludhiana",
      "Mansa",
      "Moga",
      "Muktsar",
      "Nawanshahr",
      "Pathankot",
      "Patiala",
      "Rupnagar",
      "Sahibzada Ajit Singh Nagar",
      "Sangrur",
      "Tarn Taran",
    ],
  },
  rajasthan: {
    name: "Rajasthan",
    districts: [
      "Ajmer",
      "Alwar",
      "Banswara",
      "Baran",
      "Barmer",
      "Bharatpur",
      "Bhilwara",
      "Bikaner",
      "Bundi",
      "Chittorgarh",
      "Churu",
      "Dausa",
      "Dholpur",
      "Dungarpur",
      "Hanumangarh",
      "Jaipur",
      "Jaisalmer",
      "Jalore",
      "Jhalawar",
      "Jhunjhunu",
      "Jodhpur",
      "Karauli",
      "Kota",
      "Nagaur",
      "Pali",
      "Pratapgarh",
      "Rajsamand",
      "Sawai Madhopur",
      "Sikar",
      "Sirohi",
      "Sri Ganganagar",
      "Tonk",
      "Udaipur",
    ],
  },
  "tamil-nadu": {
    name: "Tamil Nadu",
    districts: [
      "Ariyalur",
      "Chengalpattu",
      "Chennai",
      "Coimbatore",
      "Cuddalore",
      "Dharmapuri",
      "Dindigul",
      "Erode",
      "Kallakurichi",
      "Kanchipuram",
      "Kanyakumari",
      "Karur",
      "Krishnagiri",
      "Madurai",
      "Mayiladuthurai",
      "Nagapattinam",
      "Namakkal",
      "Nilgiris",
      "Perambalur",
      "Pudukkottai",
      "Ramanathapuram",
      "Ranipet",
      "Salem",
      "Sivaganga",
      "Tenkasi",
      "Thanjavur",
      "Theni",
      "Thoothukudi",
      "Tiruchirappalli",
      "Tirunelveli",
      "Tirupattur",
      "Tiruppur",
      "Tiruvallur",
      "Tiruvannamalai",
      "Tiruvarur",
      "Vellore",
      "Viluppuram",
      "Virudhunagar",
    ],
  },
  "uttar-pradesh": {
    name: "Uttar Pradesh",
    districts: [
      "Agra",
      "Aligarh",
      "Ambedkar Nagar",
      "Amethi",
      "Amroha",
      "Auraiya",
      "Ayodhya",
      "Azamgarh",
      "Baghpat",
      "Bahraich",
      "Ballia",
      "Balrampur",
      "Banda",
      "Barabanki",
      "Bareilly",
      "Basti",
      "Bijnor",
      "Budaun",
      "Bulandshahr",
      "Chandauli",
      "Chitrakoot",
      "Deoria",
      "Etah",
      "Etawah",
      "Farrukhabad",
      "Fatehpur",
      "Firozabad",
      "Gautam Buddha Nagar",
      "Ghaziabad",
      "Ghazipur",
      "Gonda",
      "Gorakhpur",
      "Hamirpur",
      "Hapur",
      "Hardoi",
      "Hathras",
      "Jalaun",
      "Jaunpur",
      "Jhansi",
      "Kannauj",
      "Kanpur Dehat",
      "Kanpur Nagar",
      "Kasganj",
      "Kaushambi",
      "Kushinagar",
      "Lakhimpur Kheri",
      "Lalitpur",
      "Lucknow",
      "Maharajganj",
      "Mahoba",
      "Mainpuri",
      "Mathura",
      "Mau",
      "Meerut",
      "Mirzapur",
      "Moradabad",
      "Muzaffarnagar",
      "Pilibhit",
      "Pratapgarh",
      "Prayagraj",
      "Raebareli",
      "Rampur",
      "Saharanpur",
      "Sambhal",
      "Sant Kabir Nagar",
      "Shahjahanpur",
      "Shamli",
      "Shrawasti",
      "Siddharthnagar",
      "Sitapur",
      "Sonbhadra",
      "Sultanpur",
      "Unnao",
      "Varanasi",
    ],
  },
  "west-bengal": {
    name: "West Bengal",
    districts: [
      "Alipurduar",
      "Bankura",
      "Birbhum",
      "Cooch Behar",
      "Dakshin Dinajpur",
      "Darjeeling",
      "Hooghly",
      "Howrah",
      "Jalpaiguri",
      "Jhargram",
      "Kalimpong",
      "Kolkata",
      "Malda",
      "Murshidabad",
      "Nadia",
      "North 24 Parganas",
      "Paschim Bardhaman",
      "Paschim Medinipur",
      "Purba Bardhaman",
      "Purba Medinipur",
      "Purulia",
      "South 24 Parganas",
      "Uttar Dinajpur",
    ],
  },
};
// Indian States and Districts Data

// ====================== Init ======================
$(document).ready(function () {
  console.group("🌱 AgriAI Signup Init");
  initializeApp();
  console.groupEnd();
});

// ====================== Initialization ======================
function initializeApp() {
  try {
    console.log("Initializing signup app...");
    setupUserTypeHandling();
    setupStepNavigation();
    setupFieldSizeRange();
    setupStateDistrictHandling();
    setupVerificationMethodHandling();
    setupOTPInputs();
    loadStateDistrictData();
    toggleUserFieldsOnLoad();
    updateStepHeader(currentStep);
    console.log("✅ Signup initialized successfully");
  } catch (err) {
    console.error("❌ Error during initialization:", err);
    showToast("Error initializing signup form", "error");
  }
}

// ====================== Step Navigation ======================
function setupStepNavigation() {
  console.log("Setting up step navigation...");

  $("#step1Next").click((e) => {
    e.preventDefault();
    console.log("Step 1 Next clicked");
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();

    if (!firstName || !lastName || !email) {
      console.warn("Step 1 validation failed");
      showToast("Please fill in all required fields", "warning");
      return;
    }
    goToStep(2);
  });

  $("#step2Next").click((e) => {
    e.preventDefault();
    console.log("Step 2 Next clicked");
    goToStep(3);
  });

  $("#step3Next").click(async (e) => {
    e.preventDefault();
    console.log("Step 3 Next clicked");
    const contact = $("#verificationContact").val().trim();
    const method = $('input[name="verificationMethod"]:checked').val();

    if (!contact) {
      console.warn("No contact entered for OTP");
      showToast("Please enter your verification contact", "warning");
      return;
    }

    try {
      console.log("Sending OTP to:", contact, "via:", method);
      const res = await fetch("/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, method }),
      });

      const result = await res.json();
      console.log("OTP send response:", result);

      if (res.ok && result.success) {
        otpSessionId = result.sessionId;
        otpVerified = false;
        console.log("✅ OTP session created:", otpSessionId);
        showToast("Verification code sent! Check your inbox.", "success");
        goToStep(4);
      } else {
        console.error("❌ OTP send failed:", result);
        showToast(result.message || "Failed to send verification code", "error");
      }
    } catch (err) {
      console.error("❌ Error sending OTP:", err);
      showToast("Could not send verification code", "error");
    }
  });

  $("#step2Back").click(() => goToStep(1));
  $("#step3Back").click(() => goToStep(2));
  $("#step4Back").click(() => goToStep(3));

  $("#createAccountBtn").click(handleAccountCreation);
}

function goToStep(step) {
  currentStep = step;
  $(".form-step").removeClass("active");
  $(`#step${step}`).addClass("active");
  updateStepProgress(step);
  updateStepHeader(step);
  console.log("Navigated to step", step);
}

function updateStepProgress(step) {
  $(".step").removeClass("active completed");
  $(".step-connector").removeClass("active");
  for (let i = 1; i <= 4; i++) {
    const $step = $(`.step[data-step="${i}"]`);
    const $connector = $step.next(".step-connector");
    if (i < step) {
      $step.addClass("completed");
      $connector.addClass("active");
    } else if (i === step) $step.addClass("active");
  }
}

// ====================== Step Headers ======================
function updateStepHeader(step) {
  const titles = {
    1: { title: "Personal Information", subtitle: "Tell us about yourself" },
    2:
      selectedUserType === "farmer"
        ? { title: "Farm Details", subtitle: "Information about your farming" }
        : { title: "Professional Details", subtitle: "Your expertise and experience" },
    3: { title: "Verification Method", subtitle: "Choose how to verify your account" },
    4: { title: "Complete Registration", subtitle: "Verify and agree to terms" },
  };
  $("#stepTitle").text(titles[step].title);
  $("#stepSubtitle").text(titles[step].subtitle);
}

// ====================== User Type Handling ======================
function setupUserTypeHandling() {
  $('input[name="signupUserType"]').change(function () {
    selectedUserType = $(this).val();
    console.log("User type selected:", selectedUserType);
    toggleUserFields();
    updateStepHeader(currentStep);
  });
}

function toggleUserFields() {
  if (selectedUserType === "farmer") {
    $(".farmer-fields").removeClass("hidden");
    $(".expert-fields").addClass("hidden");
  } else {
    $(".expert-fields").removeClass("hidden");
    $(".farmer-fields").addClass("hidden");
  }
}

function toggleUserFieldsOnLoad() {
  toggleUserFields();
}

// ====================== Field Size ======================
function setupFieldSizeRange() {
  $("#fieldSize").on("input change", function () {
    const value = $(this).val();
    $("#fieldSizeDisplay").text(`${value} Acre${value > 1 ? "s" : ""}`);
    console.log("Field size selected:", value);
  });
}



function populateStates() {
  const $stateSelect = $("#state");
  $stateSelect.empty().append('<option value="">Select State</option>');

  const stateKeys = Object.keys(stateDistrictData);
  stateKeys.forEach((key) => {
    $stateSelect.append(`<option value="${key}">${stateDistrictData[key].name}</option>`);
  });

  console.log("States populated");
}

function populateDistricts(stateKey) {
  const $districtSelect = $("#district");
  $districtSelect.empty().append('<option value="">Select District</option>');

  if (stateDistrictData[stateKey]) {
    stateDistrictData[stateKey].districts.forEach((district) => {
      $districtSelect.append(`<option value="${district}">${district}</option>`);
    });
    console.log("Districts populated for state:", stateDistrictData[stateKey].name);
  }
}


function setupStateDistrictHandling() {
  populateStates(); // populate states on load
  $("#state").change(function () {
    populateDistricts($(this).val());
  });
}


// ====================== Verification Method ======================
function setupVerificationMethodHandling() {
  $('input[name="verificationMethod"]').change(function () {
    updateVerificationInput($(this).val());
  });
}

function updateVerificationInput(method) {
  const $input = $("#verificationContact");
  const $label = $("#verificationLabel");
  if (method === "email") {
    $input.attr("type", "email").attr("placeholder", "Enter your email address");
    $label.html('<i class="fas fa-envelope"></i> Enter Email Address');
  } else {
    $input.attr("type", "tel").attr("placeholder", "Enter your phone number");
    $label.html('<i class="fas fa-phone"></i> Enter Phone Number');
  }
  console.log("Verification method set to:", method);
}

// ====================== OTP Handling ======================
function setupOTPInputs() {
  $(".otp-input").on("input", function () {
    const value = $(this).val().replace(/\D/g, "");
    $(this).val(value);
    if (value && $(this).next(".otp-input").length) $(this).next(".otp-input").focus();
  });

  $(".otp-input").on("keydown", function (e) {
    if (e.key === "Backspace" && !$(this).val() && $(this).prev(".otp-input").length) {
      $(this).prev(".otp-input").focus();
    }
  });
}

// ====================== Account Creation ======================
async function handleAccountCreation(e) {
  e.preventDefault();
  if (signupInProgress) return;
  signupInProgress = true;

  console.log("Starting account creation...");
  try {
    const otp = $(".otp-input").map((i, el) => $(el).val()).get().join("");
    console.log("Entered OTP:", otp);

    if (otp.length !== 6) {
      showToast("Please enter the complete verification code", "warning");
      signupInProgress = false;
      return;
    }

    if (!$("#agreeTerms").prop("checked")) {
      showToast("Please agree to the Terms", "warning");
      signupInProgress = false;
      return;
    }

    if (!otpSessionId) {
      showToast("OTP session not found. Please resend OTP.", "error");
      signupInProgress = false;
      return;
    }

    // Step 1: Verify OTP
    if (!otpVerified) {
      console.log("Verifying OTP with sessionId:", otpSessionId);
      const otpVerifyRes = await fetch("/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: otpSessionId, otp }),
      });
      const otpResult = await otpVerifyRes.json();
      console.log("OTP verify response:", otpResult);

      if (!otpResult.success) {
        showToast(otpResult.message || "Invalid or expired OTP", "error");
        signupInProgress = false;
        return;
      }
      otpVerified = true;
      showToast("OTP verified successfully!", "success");
    }

    // Step 2: Collect form data
    const formData = collectFormData();
    console.log("Collected formData:", formData);

    // Step 3: Send signup request
    const signupRes = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const signupResult = await signupRes.json();
    console.log("Signup response:", signupResult);

    if (signupRes.ok && signupResult.success) {
      showSuccessModal();
    } else {
      showToast(signupResult.message || "Signup failed", "error");
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
    showToast("Unexpected error during signup", "error");
  } finally {
    signupInProgress = false;
  }
}

// ====================== Form Data ======================
function collectFormData() {
  const crops = $('input[name="crops"]:checked').map((i, el) => $(el).val()).get();

  const data = {
    userType: selectedUserType,
    personal: {
      firstName: $("#firstName").val().trim(),
      lastName: $("#lastName").val().trim(),
      email: $("#email").val().trim(),
      phone: $("#phone").val().trim(),
    },
    password: $("#password").val(),
    confirmPassword: $("#confirmPassword").val(),
    verificationMethod: $('input[name="verificationMethod"]:checked').val(),
    verificationContact: $("#verificationContact").val().trim(),
    marketingEmails: $("#marketingEmails").prop("checked"),
    agreeTerms: $("#agreeTerms").prop("checked"),
  };

  if (selectedUserType === "farmer") {
    data.farm = {
      state: $("#state option:selected").text(),
      district: $("#district").val(),
      fieldSize: $("#fieldSize").val(),
      crops,
      farmingMethod: $('input[name="farmingMethod"]:checked').val(),
    };
  } else {
    data.expert = {
      expertise: $("#expertise").val(),
      experience: $("#experience").val(),
      qualification: $("#qualification").val(),
      organization: $("#organization").val(),
    };
  }

  return data;
}

// ====================== Success Modal ======================
function showSuccessModal() {
  const modal = $(`
    <div id="successModal" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <h2>Welcome to AgriAI!</h2>
        <p>Your account has been created successfully. Redirecting...</p>
      </div>
    </div>
  `);
  $("body").append(modal);
  console.log("✅ Signup successful, redirecting...");
  setTimeout(() => (window.location.href = "/dashboard"), 1500);
}

// ====================== Toast Utility ======================
function showToast(message, type = "info") {
  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };
  const toast = $(`
    <div class="toast-notification toast-${type}">
      <div><i class="fas ${icons[type]}"></i><span>${message}</span>
      <button class="close-toast"><i class="fas fa-times"></i></button></div>
    </div>
  `);
  $("body").append(toast);
  toast.find(".close-toast").click(() => toast.remove());
  setTimeout(() => toast.fadeOut(300, () => toast.remove()), 5000);
}
