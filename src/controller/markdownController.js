// getAllMarkdown
import db from "../models/index";

import { getAllMarkdownAPI } from "../services/markdownService";
export let getAllMarkdown = async (req, res) => {
  try {
    let markdown = await getAllMarkdownAPI();
    return res.status(200).json({ markdown: markdown });
  } catch (e) {
    return res.status(200).json({
      Message: "Don't find any data in Database",
      errCode: -1,
    });
  }
};
