"use strict";

const $navSubmitButton = $("#nav-submit");

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show submit form on click on "submit" */

//rename function to showstory..
function submitClick(evt) {
  console.log('button clicked: ', evt);
  // console.debug("submitClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $storySubmitForm.show();
}

$navSubmitButton.on("click", () => {
  submitClick;
  $storySubmitForm.toggleClass("hidden")
});

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

