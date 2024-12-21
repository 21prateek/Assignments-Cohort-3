let bookmarks = []; // in memory space
let currentId = 1;

async function addBookmark(req, res, next) {
  // write here
  try {
    const { category, url } = req.body;

    if (!category || !url) {
      return res.json({ message: "Please provide the information" });
    }

    const newBookmark = {
      id: currentId++,
      category,
      url,
    };

    bookmarks.push(newBookmark);
    return res.status(201).json(newBookmark);
  } catch (e) {
    next(e);
  }
}

async function deleteBookmark(req, res, next) {
  // write here
  try {
    const { id } = req.params;
    const bookIndex = bookmarks.findIndex((bookmark) => bookmark.id == id);

    if (bookIndex == -1) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    bookmarks.splice(bookIndex, 1);

    return res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (e) {
    next(e);
  }
}

async function getAllBookmarks(req, res, next) {
  // write here
  res.json(bookmarks);
}

module.exports = {
  getAllBookmarks,
  addBookmark,
  deleteBookmark,
};
