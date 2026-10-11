// ---------- Student Management System (simple version) ----------

// This array stores all students. Each student is an object like:
// { id: "S101", name: "Aarav", gender: "Male", ... }
var students = [];

// If this is "" we are ADDING a student.
// If it has an ID in it, we are EDITING that student.
var editId = "";

// ---------- Sample data (shown only the first time) ----------
function getSampleStudents() {
  return [
    { id: "S101", name: "Aarav Sharma", gender: "Male",   course: "B.Tech CSE", semester: "3", email: "aarav@example.com",  phone: "9876543210", attendance: 88 },
    { id: "S102", name: "Priya Singh",  gender: "Female", course: "BCA",        semester: "2", email: "priya@example.com",  phone: "9876501234", attendance: 92 },
    { id: "S103", name: "Rohan Verma",  gender: "Male",   course: "B.Com",      semester: "4", email: "rohan@example.com",  phone: "9812345678", attendance: 75 },
    { id: "S104", name: "Simran Kaur",  gender: "Female", course: "B.Tech ECE", semester: "5", email: "simran@example.com", phone: "9823456789", attendance: 81 },
    { id: "S105", name: "Karan Mehta",  gender: "Male",   course: "MBA",        semester: "1", email: "karan@example.com",  phone: "9834567890", attendance: 69 },
    { id: "S106", name: "Neha Gupta",   gender: "Female", course: "BBA",        semester: "6", email: "neha@example.com",   phone: "9845678901", attendance: 95 },
    { id: "S107", name: "Arjun Patel",  gender: "Male",   course: "B.Sc IT",    semester: "3", email: "arjun@example.com",  phone: "9856789012", attendance: 84 }
  ];
}

// ---------- Save data in the browser (localStorage) ----------
// localStorage can only store text, so we convert the array to text with JSON.stringify
function saveToLocalStorage() {
  localStorage.setItem("students", JSON.stringify(students));
}

// Get the data back. JSON.parse converts the text back into an array.
function loadFromLocalStorage() {
  var saved = localStorage.getItem("students");

  if (saved == null) {
    // nothing saved yet, so use the sample students
    students = getSampleStudents();
    saveToLocalStorage();
  } else {
    students = JSON.parse(saved);
  }
}

// ---------- Show students in the table ----------
// "list" is the list of students we want to show
function displayStudents(list) {
  var rows = "";

  // go through every student one by one
  for (var i = 0; i < list.length; i++) {
    var s = list[i];

    rows = rows + "<tr>";
    rows = rows + "<td>" + s.id + "</td>";
    rows = rows + "<td>" + s.name + "</td>";
    rows = rows + "<td>" + s.course + "</td>";
    rows = rows + "<td>" + s.semester + "</td>";
    rows = rows + "<td>" + s.email + "</td>";
    rows = rows + "<td>" + s.phone + "</td>";
    rows = rows + "<td>" + s.attendance + "%</td>";
    rows = rows + "<td class='actions'>";
    rows = rows + "<button class='btn small' onclick=\"editStudent('" + s.id + "')\">Edit</button> ";
    rows = rows + "<button class='btn small danger' onclick=\"deleteStudent('" + s.id + "')\">Delete</button>";
    rows = rows + "</td>";
    rows = rows + "</tr>";
  }

  // put all the rows inside the table
  document.getElementById("studentTable").innerHTML = rows;

  // show or hide the "No students found" message
  if (list.length == 0) {
    document.getElementById("noResults").classList.remove("hidden");
  } else {
    document.getElementById("noResults").classList.add("hidden");
  }
}

// ---------- Update the dashboard cards ----------
function updateDashboard() {
  var male = 0;
  var female = 0;
  var totalAttendance = 0;

  for (var i = 0; i < students.length; i++) {
    if (students[i].gender == "Male") {
      male = male + 1;
    }
    if (students[i].gender == "Female") {
      female = female + 1;
    }
    totalAttendance = totalAttendance + students[i].attendance;
  }

  // average = total attendance / number of students
  var average = 0;
  if (students.length > 0) {
    average = totalAttendance / students.length;
  }

  document.getElementById("totalStudents").innerHTML = students.length;
  document.getElementById("maleStudents").innerHTML = male;
  document.getElementById("femaleStudents").innerHTML = female;
  document.getElementById("avgAttendance").innerHTML = average.toFixed(1) + "%";
}

// ---------- Search ----------
// Runs every time the user types in the search box
function searchStudents() {
  var text = document.getElementById("searchBox").value.toLowerCase();
  var result = [];

  for (var i = 0; i < students.length; i++) {
    var s = students[i];

    // indexOf gives -1 if the text is NOT found
    var inId = s.id.toLowerCase().indexOf(text);
    var inName = s.name.toLowerCase().indexOf(text);
    var inCourse = s.course.toLowerCase().indexOf(text);

    if (inId != -1 || inName != -1 || inCourse != -1) {
      result.push(s);   // add this student to the result list
    }
  }

  displayStudents(result);
}

// ---------- Open and close the form ----------
function openForm() {
  editId = "";   // we are adding a new student
  document.getElementById("studentForm").reset();   // clear old values
  document.getElementById("formTitle").innerHTML = "Add Student";
  document.getElementById("errorMsg").innerHTML = "";   // clear old error message
  document.getElementById("modal").classList.remove("hidden");
}

function closeForm() {
  document.getElementById("modal").classList.add("hidden");
}

// ---------- Check the form (validation) ----------
// Returns a message if something is wrong, or "" if all is OK
function validateForm(s) {
  // 1. required fields
  if (s.id == "" || s.name == "" || s.gender == "" || s.course == "" ||
      s.semester == "" || s.email == "" || s.phone == "" || s.attendance == "") {
    return "Please fill in all fields.";
  }

  // 2. email must have @ and a dot after it
  var at = s.email.indexOf("@");
  var dot = s.email.lastIndexOf(".");
  if (at < 1 || dot < at + 2 || dot == s.email.length - 1) {
    return "Please enter a valid email.";
  }

  // 3. attendance between 0 and 100
  var att = Number(s.attendance);
  if (isNaN(att) || att < 0 || att > 100) {
    return "Attendance must be between 0 and 100.";
  }

  // 4. Student ID must not already be used by someone else
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == s.id && students[i].id != editId) {
      return "This Student ID already exists.";
    }
  }

  return "";   // no problem found
}

// ---------- Runs when the Save button is clicked ----------
function saveStudent(event) {
  event.preventDefault();   // stops the page from reloading

  // read the values from the form
  var s = {
    id: document.getElementById("studentId").value.trim(),
    name: document.getElementById("name").value.trim(),
    gender: document.getElementById("gender").value,
    course: document.getElementById("course").value.trim(),
    semester: document.getElementById("semester").value,
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    attendance: document.getElementById("attendance").value
  };

  // check for mistakes
  var message = validateForm(s);
  if (message != "") {
    document.getElementById("errorMsg").innerHTML = message;
    return;   // stop here, do not save
  }

  s.attendance = Number(s.attendance);   // convert text to number

  if (editId == "") {
    addStudent(s);
  } else {
    // find the old student and replace it with the new data
    for (var i = 0; i < students.length; i++) {
      if (students[i].id == editId) {
        students[i] = s;
      }
    }
  }

  saveToLocalStorage();
  closeForm();
  searchStudents();      // refresh the table
  updateDashboard();     // refresh the cards
}

// ---------- Add a new student ----------
function addStudent(s) {
  students.push(s);   // push adds to the end of the array
}

// ---------- Edit a student ----------
function editStudent(id) {
  // find the student with this ID
  for (var i = 0; i < students.length; i++) {
    if (students[i].id == id) {
      var s = students[i];

      editId = id;   // remember which student we are editing

      // put the old values into the form
      document.getElementById("studentId").value = s.id;
      document.getElementById("name").value = s.name;
      document.getElementById("gender").value = s.gender;
      document.getElementById("course").value = s.course;
      document.getElementById("semester").value = s.semester;
      document.getElementById("email").value = s.email;
      document.getElementById("phone").value = s.phone;
      document.getElementById("attendance").value = s.attendance;

      document.getElementById("formTitle").innerHTML = "Edit Student";
      document.getElementById("errorMsg").innerHTML = "";
      document.getElementById("modal").classList.remove("hidden");
    }
  }
}

// ---------- Delete a student ----------
function deleteStudent(id) {
  // confirm() shows an OK / Cancel box
  var sure = confirm("Are you sure you want to delete this student?");
  if (sure == false) {
    return;
  }

  // make a new array that has everyone EXCEPT the deleted student
  var newList = [];
  for (var i = 0; i < students.length; i++) {
    if (students[i].id != id) {
      newList.push(students[i]);
    }
  }
  students = newList;

  saveToLocalStorage();
  searchStudents();
  updateDashboard();
}

// ---------- This runs when the page opens ----------
loadFromLocalStorage();
displayStudents(students);
updateDashboard();
