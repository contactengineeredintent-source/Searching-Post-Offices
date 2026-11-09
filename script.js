let ipAddressTagFirstPage = document.querySelector("#ip_address_first_page");
let ipAddressTagSecondPage = document.querySelector("#ip_address_second_page");

let userIp = "";
async function getIp() {
  try {
    const response = await fetch("https://api.ipify.org/?format=json");
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error in fething the api", error);
  }
}
function renderIp(ipObj) {
  // console.log(ipObj.ip);
  userIp = ipObj.ip;
  ipAddressTagFirstPage.textContent = ipObj.ip;
}

getIp().then((data) => {
  renderIp(data);
});

async function getUserData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("error in fetching user data", error);
  }
}

async function getPostOffices(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error while getting post offices nearby: ", error);
  }
}

function getUserLocation(latitude, longitude) {
  document.querySelector("#mapFrame").src =
    `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
}

let postOffcesGrid = document.querySelector("#post_office_cards");
function renderPostOffices(postOffceObj) {
  let cardContainer = document.createElement("div");
  cardContainer.classList.add("gridCard", "m-4", "p-4", "fs-5", "fw-bold");
  let nameTag = document.createElement("p");
  nameTag.textContent = "Name: ";
  let nameValueTag = document.createElement("span");
  nameValueTag.textContent = postOffceObj.Name;
  nameValueTag.classList.add("fs-5", "text-white");
  nameTag.appendChild(nameValueTag);

  let branchTag = document.createElement("p");
  branchTag.textContent = "Branch Type: ";
  let branchValueTag = document.createElement("span");
  branchValueTag.classList.add("fs-5", "text-white");
  branchValueTag.textContent = postOffceObj.BranchType;
  branchTag.appendChild(branchValueTag);

  let deliveryTag = document.createElement("p");
  deliveryTag.textContent = "DeliveryStatus: ";
  let deliveryValueTag = document.createElement("span");
  deliveryValueTag.classList.add("fs-5", "text-white");
  deliveryValueTag.textContent = postOffceObj.DeliveryStatus;
  deliveryTag.appendChild(deliveryValueTag);

  let districtTag = document.createElement("p");
  districtTag.textContent = "District: ";
  let districtValueTag = document.createElement("span");
  districtValueTag.classList.add("fs-5", "text-white");
  districtValueTag.textContent = postOffceObj.District;
  districtTag.appendChild(districtValueTag);

  let divisionTag = document.createElement("p");
  divisionTag.textContent = "Division: ";
  let divisionValueTag = document.createElement("span");
  divisionValueTag.classList.add("fs-5", "text-white");
  divisionValueTag.textContent = postOffceObj.Division;
  divisionTag.appendChild(divisionValueTag);

  cardContainer.appendChild(nameTag);
  cardContainer.appendChild(branchTag);
  cardContainer.appendChild(deliveryTag);
  cardContainer.appendChild(districtTag);
  cardContainer.appendChild(divisionTag);
  postOffcesGrid.appendChild(cardContainer);
}

function renderUserLocation(ipObj) {
  // console.log(longitude);
  let userLatitude = ipObj.latitude;
  let userLongitude = ipObj.longitude;
  let userCity = ipObj.city;
  let userRegion = ipObj.region;
  let userOrg = ipObj.org;
  let userTimezone = ipObj.timezone;
  let userPincode = ipObj.postal;
  document.querySelector("#latitude_tag").textContent = userLatitude;
  document.querySelector("#longitude_tag").textContent = userLongitude;
  document.querySelector("#city_tag").textContent = userCity;
  document.querySelector("#region_tag").textContent = userRegion;
  document.querySelector("#organisation_tag").textContent = userOrg;
  document.querySelector("#host_tag").textContent = userLatitude;
  document.querySelector("#timezone").textContent = userTimezone;
  document.querySelector("#pincode").textContent = userPincode;
  const currentDateTime = new Date().toLocaleString("en-IN", {
    timezone: userTimezone,
  });
  document.querySelector("#date_and_time").textContent = currentDateTime;
  // console.log(currentDateTime);
  getPostOffices(`https://api.postalpincode.in/pincode/${userPincode}`).then(
    (data) => {
      postofficesArr = data[0].PostOffice;
      // console.log(data[0].PostOffice);
      postofficesArr.forEach((postOffice) => {
        renderPostOffices(postOffice);
      });
    },
  );
  let postofficesArr = [];
  let searchBar = document.querySelector("#search_bar");
  searchBar.addEventListener("input", (e) => {
    e.preventDefault();
    let searchValue = searchBar.value.toLowerCase().trim();
    // console.log(postofficesArr);
    let matchArr = postofficesArr.filter((postoffice) => {
      return (
        postoffice.Name.toLowerCase().includes(searchValue) ||
        postoffice.BranchType.toLowerCase().includes(searchValue)
      );
    });

    // console.log(matchArr);
    if (matchArr.length > 0) {
      postOffcesGrid.innerHTML = "";
      matchArr.forEach((matchObj) => {
        renderPostOffices(matchObj);
      });
    }
  });
}

document.querySelector("#get_started_btn").addEventListener("click", (e) => {
  e.preventDefault();
  getUserLocation();
  document.querySelector("#landing_page").classList.add("d-none");
  document.querySelector("#user_location_page").classList.remove("d-none");
  ipAddressTagSecondPage.textContent = userIp;
  getUserData(`https://ipapi.co/${userIp}/json`).then((data) => {
    // console.log(data);
    let latitude = data.latitude;
    let longitude = data.longitude;
    getUserLocation(latitude, longitude);
    renderUserLocation(data);
  });
});
