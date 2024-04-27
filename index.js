import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/bidder", async (req, res) => {
  try {
    const filters = req.query.filters;
    const response = await axios.get(process.env.BIDDERS_TABLE_LINK, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        filters: filters,
      },
    });
    return res.json(response.data);
  } catch (error) {
    console.error("Error executing request:", error);
    res.status(500).json({ error: "Error executing request" });
  }
});

app.put("/bidder/:id", async (req, res) => {
  const bidderId = req.params.id;
  const updatedFields = req.body.fields;

  try {
    const response = await axios.put(
      `${process.env.BIDDERS_TABLE_LINK}/${bidderId}`,
      {
        fields: updatedFields,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ error: "Error updating record" });
  }
});

app.listen(process.env.PORT || 4200, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
