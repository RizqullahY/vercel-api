import { getTokenName } from "../models/tokenModel";  
import { addQuote } from "../models/quoteModel";     

export const postQuote = (req: any, res: any) => {
  const { token, quote } = req.body;

  if (!token || !quote) {
    return res.status(400).json({ status: "error", message: "Token and Quote are required" });
  }

  getTokenName(token)
    .then((name) => {
      if (name) {
        const newQuote = { token, name, quote };
        addQuote(newQuote);

        return res.json({
          status: "success",
          data: newQuote,
        });
      } else {
        return res.status(404).json({ status: "error", message: "Token not found" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ status: "error", message: err.message });
    });
};
