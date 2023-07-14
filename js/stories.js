"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** Hides favorites list when returning to home page */

$home.on("click", () => {
  putStoriesOnPage;
  $favoriteStoriesList.hide();
});

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  const hostName = story.getHostName();
  //preserve favorite state
  return $(`
      <li id="${story.storyId}">
        ${saveFavoriteIcon(story, currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function saveFavoriteIcon(story, user) {
  const favoriteStory = user.savedFavorite(story);
  if (favoriteStory) {
    return `
    <span>
    <i class="fa-solid fa-bookmark"></i>
    </span>`;
  } else {
    return `
    <span>
    <i class="fa-regular fa-bookmark"></i>
    </span>`;
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Add story to page on form submit */

async function submitStory(evt) {
  evt.preventDefault();

  const title = $("#title-input").val();
  const author = $("#author-input").val();
  const url = $("#url-input").val();
  const username = currentUser.username;
  const storyData = { title, author, url, username };

  const currStory = await storyList.addStory(currentUser, storyData);

  const $newStory = generateStoryMarkup(currStory);
  $allStoriesList.prepend($newStory);
  $storySubmitForm.hide();
}

$storySubmitForm.on("submit", submitStory);

/** Only show favorites section */

function putFavoritesOnPage() {
  hidePageComponents();
  $favoriteStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $favoriteStoriesList.append($story);
  }
  $(".fa-bookmark").toggleClass("fa-solid fa-regular");
  //TODO: correct icon, storyId still undefined

  $favoriteStoriesList.show();
}

$favoritesButton.on("click", putFavoritesOnPage);

/** Adds/removes favorite and toggles icon */

async function toggleFavorite(evt) {
  const $target = $(evt.target);//.closest("i");
  const $targetStoryId = $target.closest("li").attr("id");
  //gets ID from API...again?? via static lookup? why???
  const $returnedStory = await Story.getStoryId($targetStoryId);
  const $returnedStoryId = $returnedStory.storyId;

  //doesn't need to be jQuery object
  let targetStory = storyList.stories.find(story =>
    story.storyId === $returnedStoryId);
  //combine these two /\   \/
  if ($target.hasClass("fa-solid")) {
    targetStory = currentUser.favorites.find(story =>
      story.storyId === $returnedStoryId);
    await currentUser.removeFavorite(targetStory);
    $target.toggleClass("fa-regular fa-solid");
  } else {
    await currentUser.addFavorite(targetStory);
    $target.toggleClass("fa-regular fa-solid");
  }
}

$allStoriesList.on("click", ".fa-bookmark", toggleFavorite);

$favoriteStoriesList.on("click", ".fa-bookmark", toggleFavorite);

// const $bothStoriesLists ?

