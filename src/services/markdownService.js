import db from "../models/index";

export let getAllMarkdownAPI = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let markdown = await db.Markdown.findAll();
      if (markdown) {
        resolve({
          errCode: 0,
          Message: "Fetch All Markdown Successfully",
          markdown: markdown,
        });
      } else {
        resolve({
          errCode: 1,
          Message: "Don't find any Data in DB",
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

export let getAllMarkdownAPI1 = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve({ errCode: 0, Message: "Fetch All Markdown Successfully" });
    } catch (err) {
      reject(err);
    }
  });
};
