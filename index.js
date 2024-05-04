import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: [process.env.FORM_LINK, "http://localhost:4200"],
  }),
);

app.get("/bidder", async (req, res) => {
  try {
    const filters = req.query.filters;
    const response = await axios.get(process.env.BIDDERS_TABLE_LINK_GR, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      params: {
        filters: filters,
      },
    });
    const filteredResponse = response.data.map(({ _id, A, B }) => ({
      _id,
      A,
      B,
    }));

    return res.status(200).json(filteredResponse);
  } catch (error) {
    console.error("Error executing request:", error);
    res.status(500).json({ error: "Error executing request" });
  }
});

app.put("/bidder/:id", async (req, res) => {
  const bidderId = req.params.id;
  const updatedFields = req.body.fields;

  try {
    let response = await axios.put(
      `${process.env.BIDDERS_TABLE_LINK_GR}/${bidderId}`,
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
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error updating record:", error);
    res.status(500).json({ error: "Error updating record" });
  }
});

app.listen(process.env.PORT || 4200, () => {
  console.log(`http://localhost:${process.env.PORT}`);
});
