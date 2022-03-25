/**
 * File: client.js
 * CSc 337 Final project Fall 2021
 * Authors: Muhtasim Al-Farabi, Shyambhavi
 * Purpose: This file is contains the client code for localbizz webapp.
 * It contains all the necessary function to execute the application.
 */

/**
 * This function uses an XMLHttpRequest to the server when the login button
 * is clicked. It sends the username in the url.
 */

function edit() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
        console.log(httpRequest.response);
    }
  }
}

let u = document.getElementById('usernameLogin').value;
let url = '/edit/' + u;
 httpRequest.open('GET', url, true);
  httpRequest.send();
}

/**
 * This function uses an XMLHttpRequest to the server when the logout button
 * is clicked.
 */

function logout() {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState == XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {

    }
  }
}
 httpRequest.open('GET', '/logout/', true);
  httpRequest.send();
}

/**
 * This function uses an XMLHttpRequest to the server when the signup button
 * is clicked. It sends the username, encoded password, personal name, email,
 * description, price, and class of the service in the url.
 */

  function createAccount() {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          window.location = './login.html';
        } else { alert('ERROR'); }
      }
    }

    let u = document.getElementById('usernameCreate').value;
    let p = document.getElementById('passwordCreate').value;
    let n = document.getElementById('name').value.toLowerCase();
    let b = document.getElementById('bio').value;
    let e = document.getElementById('email').value;
    let pName = document.getElementById('pName').value.toLowerCase();
    let catagory = document.getElementById('serviceCategory').value.toLowerCase();
    let price = document.getElementById('price').value;
    console.log(pName);
    var url ='/create/' + u + '/' + encodeURIComponent(p) + '/'
   + pName + '/' +  n + '/' + b + '/' + e + '/' + catagory + '/' +
   price + '/';

   console.log(url);
    httpRequest.open('GET',url, true);
    httpRequest.send();
  }
/**
 * This function uses an XMLHttpRequest to the server when a customer searches
 * for freelancers. It runs the constructSearchResult function that creates
 * div that contains search results
 * */
  function searchServices(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      return false;
    }

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
          var responseArray = JSON.parse(httpRequest.responseText);
          if (responseArray.length==0){
            document.getElementById('searchResults').innerHTML="<h3>Sorry this service is not available. Try searching something else!</h3>";

          }else{
            var resultsString=constructSearchResult(responseArray);
            document.getElementById('searchResults').innerHTML=resultsString;

          }
        }
      }
    }
    var searchKey = document.getElementById('searchServiceBar').value.toLowerCase();
    let url = '/search/services/'+searchKey;
    httpRequest.open('GET', url);
    httpRequest.send();


  }

  /**
   * This function takes in a response array from the server and returns
   * the search results in a string (formatted for HTML)
   * @param {Array} responseArray, response array from the server
   * @returns a string with HTML for relevant search results
   */

  function constructSearchResult(responseArray){
    var resultsString=""
    for (var i=0;i<responseArray.length;i++){
      var response = responseArray[i];
      var serviceName = response.name;
      serviceName= serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
      var personName = response.personName;
      personName= personName.charAt(0).toUpperCase() + personName.slice(1);
      var serviceType = response.class;
      serviceType= serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
      var description = response.bio;
      var contact= response.contact;
      var price = response.price;
      resultsString+="<div class='search'>";
      resultsString+="<h3>Service: "+serviceName+"</h3><br>";
      resultsString+="Freelancer Name: "+personName+"<br>";
      resultsString+="Service Category: "+serviceType+"<br>";
      resultsString+="Description: "+description+"<br>";
      resultsString+="Contact: <a href=mailto:"+contact+">"+ contact+"</a><br>";
      resultsString+="Price($/hr): "+price+"<br></div>";
    }

    return resultsString;

  }

  /**
   * This function uses an XMLHttpRequest to the server when the user clicks
   * the login button. It logs the user in and redirects them to the welcome page
   */

  function login() {
    var httpRequest = new XMLHttpRequest();

    let u = document.getElementById('usernameLogin').value;
    let p = document.getElementById('passwordLogin').value;

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState == XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
          if (httpRequest.responseText != false) {
            window.location="welcome.html";

          } else {
            alert('FAILED TO LOGIN 1');
          }
        } else {
          alert('FAILED TO LOGIN 2');
        }
      }
    }

    httpRequest.open('GET', '/login/' + u + '/' + encodeURIComponent(p), true);
    httpRequest.send();
  }

/**
   * This function uses an XMLHttpRequest to the server right after the user
   * logs into the application. Its purpose is to store the user Information
   * that will be user later.
   */
function getSellerInfo(){
  var httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    return false;
  }
  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status == 200) {
        var response = JSON.parse(httpRequest.responseText);
        makeWelcomePage(response);
        }
      }
    }
  let url = '/welcome/';
  httpRequest.open('GET', url);
  httpRequest.send();
}

/**
 * This function takes in a JSON Object containing all the information
 * about an user and the shows that in the welcome page when the "view
 * information" button is clicked.
 * @param {Object} response, a response in JSON format
 */

  function makeWelcomePage(response){
    var serviceName = response.name;
    serviceName= serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
    var personName = response.personName;
    personName= personName.charAt(0).toUpperCase() + personName.slice(1);
    var serviceType = response.class;
    serviceType= serviceType.charAt(0).toUpperCase() + serviceType.slice(1);
    var description = response.bio;
    var contact= response.contact;
    var price = response.price;


    document.getElementById('welcomeService').innerText= serviceName;
    document.getElementById('welcomeName').innerText= personName;
    document.getElementById('welcomeCategory').innerText= serviceType;
    document.getElementById('welcomeDescription').innerText= description;
    document.getElementById('welcomeContact').innerText= contact;
    document.getElementById('welcomePrice').innerText= price;

    var editDivs= document.getElementsByClassName('editDiv');
    for(let i=0;i<editDivs.length;i++){
      editDivs[i].innerHTML="";
    }
  }
  /**
 * This function creates input boxes and fills them with the data already
 * present on the welcome page. An user can edit the information now.
 */

  function editSellerInformation(){
    serviceName = document.getElementById('welcomeService').innerText.toLowerCase();
    personName = document.getElementById('welcomeName').innerText.toLowerCase();
    serviceType = document.getElementById('welcomeCategory').innerText.toLowerCase();
    description = document.getElementById('welcomeDescription').innerText;
    contact = document.getElementById('welcomeContact').innerText;
    price = document.getElementById('welcomePrice').innerText;
    console.log(typeof(description));

    var editDivs=document.getElementsByClassName('editDiv');
    editDivs[0].innerHTML="<input class='searchBar editBar' id='editServiceName' 'type='text' value='" + serviceName + "'>";
    editDivs[1].innerHTML="<input class='searchBar editBar' id='editPersonName' 'type='text' value='" + personName + "'>";
    editDivs[3].innerHTML="<input class='searchBar editBar' id='editDescription' 'type='text' value='" + description + "'>";
    editDivs[4].innerHTML="<input class='searchBar editBar' id='editContact' 'type='email' value='" + contact + "'>";
    editDivs[5].innerHTML="<input class='searchBar editBar' id='editPrice' 'type='text' value='" + price + "'>";
    console.log(editDivs[3].innerHTML);
    var editCategory="";

    editCategory+='<select class="searchBar editBar" name="serviceCategory" id="editServiceCategory" required>';
    editCategory+='<option value="development">IT & Development</option>';
    editCategory+='<option value="design">Design & Creative</option>';
    editCategory+='<option value="sales">Sales & Marketing</option>';
    editCategory+='<option value="writing">Writing & Translation</option>';
    editCategory+='<option value="support">Admin & Customer Support</option>';
    editCategory+='<option value="finance">Finance</option>';
    editCategory+='<option value="legal">Legal</option>';
    editCategory+='<option value="engineering">Engineering & Architecture</option>';
    editCategory+='<option value="homeService">Home Services</option>';
    editCategory+='<option value="other">Other</option>';
    editCategory+='</select>';
    document.getElementById('editWelcomeCategory').innerHTML=editCategory;
    document.getElementById('saveChangesdiv').innerHTML='<button id="saveChanges" onclick="submitEditedInfo();" class="Button" type="button" name="button">Save Changes</button>';

  }

  /**
   * This function sends an XMLHttpRequest to the server when the submit
   * button is clicked. It hides the input boxes and the data on the welcome
   * page, and also it sends the new information to the get request associated
   * with this function so that it gets saved into the database.
   *
   */

  function submitEditedInfo(){
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      return false;
    }

    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
          }
        }
      }
      s = document.getElementById('editServiceName').value;
      p = document.getElementById('editPersonName').value;
      e = document.getElementById('editServiceCategory');
      type = e.options[e.selectedIndex].text;
      d = document.getElementById('editDescription').value;
      c = document.getElementById('editContact').value;
      price = document.getElementById('editPrice').value;

      var editDivs= document.getElementsByClassName('editDiv');

      for(let i=0;i<editDivs.length;i++){
      editDivs[i].innerHTML="";
    }

    var welcomeDivs= document.getElementsByClassName('WelcomeDivs');

      for(let i=0;i<welcomeDivs.length;i++){
      welcomeDivs[i].innerHTML="";
    }



    let url = '/edit/'+s+'/'+p+'/'+type+'/'+d+'/'+c+'/'+price+'/';
    httpRequest.open('GET', url);
    httpRequest.send();

  }
