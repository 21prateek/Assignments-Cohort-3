const API_URL = "http://localhost:3002/bookmarks";

// Fetch bookmarks when the page loads
document.addEventListener("DOMContentLoaded", () => {
  //   start here
  fetchBookmarks();
});

// Fetch bookmarks from the backend
function fetchBookmarks() {
  //  start here
  fetch(API_URL)
    .then((response) => response.json)
    .then((data) => {
      console.log(data);

      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        const bookmark = data.bookmarks;

        bookmark.forEach((x) => addBookmarkToDOM(x));
      } else {
        console.error("Unexpected response structure:", data);
      }
    })
    .catch((error) => console.error("Error ", error));
}

// Add a bookmark to the DOM
function addBookmarkToDOM(bookmark) {
  //  start here
  console.log(bookmark);

  const bookmarkList = document.getElementById("bookmark-list");

  const bookmarkItem = document.createElement("li");
  bookmarkItem.classList.add("bookmark-item");
  bookmarkItem.setAttribute("data-id", bookmark.id);

  const url = document.createElement("span");
  console.log(bookmark.bookmark?.url);
  url.textContent = `${bookmark.url} (${bookmark.category})`;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => deleteBookmark(bookmark.id));

  bookmarkItem.appendChild(url);
  bookmarkItem.appendChild(deleteButton);

  bookmarkList.appendChild(bookmarkItem);
}

// Add a new bookmark
document.getElementById("add-bookmark-btn").addEventListener("click", () => {
  //  start here
  const urlInput = document.getElementById("bookmark-url");
  const categoryInput = document.getElementById("bookmark-category");

  if (
    !urlInput ||
    !categoryInput ||
    urlInput.value.trim() === "" ||
    categoryInput.value.trim() === ""
  ) {
    console.error("Please provide both URL and category.");
    return;
  }

  const newBookmark = { category: categoryInput.value, url: urlInput.value };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newBookmark),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.id) {
        // Update the DOM with the newly added bookmark
        addBookmarkToDOM(data);
        urlInput.value = ""; // Clear input fields
        categoryInput.value = ""; // Clear input fields
      } else {
        console.error("Error adding bookmark:", data);
      }
    })

    .catch((error) => console.error("Error adding bookmark:", error));
});

// Delete a bookmark
function deleteBookmark(id) {
  //  start here;
  fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      const bookmarkItem = document.querySelector(`[data-id='${id}']`);
      bookmarkItem.remove();
    })
    .catch((error) => console.error("Error deleting bookmark:", error));
}
