import fs from "fs";
import path from "path";

const dataFilePath = path.resolve(__dirname, "../data/data.json");

export const addQuote = (quote: { token: string; name: string; quote: string }) => {
  fs.readFile(dataFilePath, "utf-8", (err, data) => {
    if (err) {
      throw new Error("Unable to read data.json");
    } else {
      try {
        const quotes = JSON.parse(data);
        quotes.push(quote);
        fs.writeFileSync(dataFilePath, JSON.stringify(quotes, null, 2));
      } catch (error) {
        throw new Error("Error parsing data.json");
      }
    }
  });
};
