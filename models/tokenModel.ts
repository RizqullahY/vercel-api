import fs from "fs";
import path from "path";

const tokenFilePath = path.resolve(__dirname, "../data/token.json");

export const getTokenName = (token: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    fs.readFile(tokenFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(new Error("Unable to read token.json"));
      } else {
        try {
          const tokens = JSON.parse(data).tokens;
          const tokenData = tokens.find((item: any) => item.access_token === token);
          if (tokenData) {
            resolve(tokenData.name);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(new Error("Error parsing token.json"));
        }
      }
    });
  });
};
