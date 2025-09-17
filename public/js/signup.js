// ====================== signup.js ======================

// Global variables
let selectedUserType = $("input[name='signupUserType']:checked").val() || "farmer";
let currentStep = 1;
let otpSessionId = null; 



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


// Document ready
$(document).ready(function () {
  console.group("🌱 AgriAI Signup Init");
  initializeApp();
  console.groupEnd();
});

function initializeApp() {
  setupUserTypeHandling();
  setupStepNavigation();
  setupFieldSizeRange();
  setupStateDistrictHandling();
  setupVerificationMethodHandling();
  setupOTPInputs();
  populateStates();
  toggleUserFieldsOnLoad();
  updateStepHeader(currentStep);

  console.log("✅ Signup JS Initialized");
}

// ====================== Step Navigation ======================
function setupStepNavigation() {
  $("#step1Next").click((e) => {
    e.preventDefault();
    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();

    if (!firstName || !lastName || !email) {
      showToast("Please fill in all required fields", "warning");
      return;
    }
    goToStep(2);
  });

  $("#step2Next").click((e) => { e.preventDefault(); goToStep(3); });
  $("#step3Next").click((e) => {
    e.preventDefault();
    const contact = $("#verificationContact").val().trim();
    if (!contact) {
      showToast("Please enter your verification contact", "warning");
      return;
    }
    goToStep(4);
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

function updateStepHeader(step) {
  const titles = {
    1: { title: "Personal Information", subtitle: "Tell us about yourself" },
    2: selectedUserType === "farmer"
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
  });
}

function setFieldSize(acres) {
  $("#fieldSize").val(acres);
  $("#fieldSizeDisplay").text(`${acres} Acre${acres > 1 ? "s" : ""}`);
}

// ====================== State/District Handling ======================
function setupStateDistrictHandling() {
  $("#state").change(function () { populateDistricts($(this).val()); });
}

function populateStates() {
  const $stateSelect = $("#state");
  $stateSelect.empty().append('<option value="">Select State</option>');
  Object.entries(stateDistrictData).forEach(([key, value]) => {
    $stateSelect.append(`<option value="${key}">${value.name}</option>`);
  });
}

function populateDistricts(stateKey) {
  const $districtSelect = $("#district");
  $districtSelect.empty().append('<option value="">Select District</option>');
  if (stateKey && stateDistrictData[stateKey]) {
    stateDistrictData[stateKey].districts.forEach((district) => {
      $districtSelect.append(`<option value="${district.toLowerCase().replace(/\s+/g, "-")}">${district}</option>`);
    });
  }
}

// ====================== Verification Method ======================
function setupVerificationMethodHandling() {
  $('input[name="verificationMethod"]').change(function () { updateVerificationInput($(this).val()); });
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
}

// ====================== OTP Handling ======================
// ====================== OTP Handling ======================
function setupOTPInputs() {
  $(".otp-input").on("input", function () {
    const $this = $(this);
    const value = $this.val().replace(/\D/g, "");
    $this.val(value);
    if (value && $this.next(".otp-input").length) $this.next(".otp-input").focus();
  });

  $(".otp-input").on("keydown", function (e) {
    if (e.key === "Backspace" && !$(this).val() && $(this).prev(".otp-input").length) {
      $(this).prev(".otp-input").focus();
    }
  });

  $("#resendCode").click(async () => {
    if (!otpSessionId) {
      showToast("Please enter contact and request OTP first", "warning");
      return;
    }
    try {
      console.log("🔄 Resending OTP:", otpSessionId);
      const res = await fetch("/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: otpSessionId }),
      });
      const result = await res.json();
      if (res.ok) showToast("OTP resent successfully!", "success");
      else showToast(result.message || "Failed to resend OTP", "error");
    } catch (err) {
      console.error("❌ Resend OTP error:", err);
    }
  });
}

// ====================== Account Creation ======================
async function handleAccountCreation(e) {
  e.preventDefault();

  const otp = $(".otp-input").map((i, el) => $(el).val()).get().join("");
  if (otp.length !== 6) { showToast("Please enter the complete verification code", "warning"); return; }
  if (!$("#agreeTerms").prop("checked")) { showToast("Please agree to the Terms", "warning"); return; }

  try {
    console.log("📤 Verifying OTP:", otp);
    const otpVerifyRes = await fetch("/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: otpSessionId, otp }),
    });
    const otpResult = await otpVerifyRes.json();
    if (!otpVerifyRes.ok || !otpResult.valid) {
      showToast("Invalid or expired OTP", "error");
      return;
    }

    const formData = collectFormData();
    console.log("📤 Final Signup Payload:", formData);

    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log("📥 Signup response:", response.status, result);

    if (response.ok) showSuccessModal();
    else showToast(result.message || "Signup failed", "error");
  } catch (error) {
    console.error("❌ Signup error:", error);
    showToast("Unexpected error during signup", "error");
  }
}

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
      state: $("#state").val(),
      district: $("#district").val(),
      fieldSize: $("#fieldSize").val(),
      crops: crops,
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
  console.log("Form data" , data)
  return data;
}



// ====================== Success Modal ======================
function showSuccessModal() {
  const modal = $(`
    <div id="successModal" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <h2>Welcome to AgriAI!</h2>
        <p>Your account has been created successfully. Get ready to revolutionize your ${selectedUserType === "farmer" ? "farming" : "advisory"} experience!</p>
        <button id="goDashboardBtn" class="btn-primary"><i class="fas fa-home me-2"></i>Go to Dashboard</button>
      </div>
    </div>
  `);
  $("body").append(modal);
  $("#goDashboardBtn").click(() => window.location.href = "/dashboard");
}

// ====================== Utility Functions ======================
function togglePassword(inputId) {
  const $input = $(`#${inputId}`);
  const $toggle = $input.siblings(".password-toggle").find("i");
  if ($input.attr("type") === "password") { 
    $input.attr("type", "text"); 
    $toggle.removeClass("fa-eye").addClass("fa-eye-slash"); 
  } else { 
    $input.attr("type", "password"); 
    $toggle.removeClass("fa-eye-slash").addClass("fa-eye"); 
  }
}

function showToast(message, type = "info") {
  const icons = { success: "fa-check-circle", error: "fa-exclamation-circle", warning: "fa-exclamation-triangle", info: "fa-info-circle" };
  const toast = $(`<div class="toast-notification toast-${type}">
    <div><i class="fas ${icons[type]}"></i><span>${message}</span><button class="close-toast"><i class="fas fa-times"></i></button></div>
  </div>`);
  $("body").append(toast);
  toast.find(".close-toast").click(() => toast.remove());
  setTimeout(() => toast.fadeOut(300, () => toast.remove()), 5000);
}

// ====================== Global Assignments ======================
window.setFieldSize = setFieldSize;
window.togglePassword = togglePassword;

console.log("🌱 AgriAI Signup JS Loaded Successfully");
