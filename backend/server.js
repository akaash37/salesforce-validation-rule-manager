const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/auth/salesforce", (req, res) => {

  const authUrl =
    `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/authorize` +
    `?response_type=code` +
    `&client_id=${process.env.SALESFORCE_CLIENT_ID}` +
    `&redirect_uri=${process.env.SALESFORCE_REDIRECT_URI}`;

  res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {

  const code = req.query.code;

  try {

    const response = await axios.post(
      `${process.env.SALESFORCE_LOGIN_URL}/services/oauth2/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.SALESFORCE_CLIENT_ID,
          client_secret: process.env.SALESFORCE_CLIENT_SECRET,
          redirect_uri: process.env.SALESFORCE_REDIRECT_URI,
          code: code
        }
      }
    );

    const accessToken = response.data.access_token;
    const instanceUrl = response.data.instance_url;

    res.redirect(
    `http://localhost:3000/callback?token=${accessToken}&instance_url=${encodeURIComponent(instanceUrl)}`
    );

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).send("Authentication Failed");
  }
});

app.get("/validation-rules", async (req, res) => {

  const accessToken = req.headers.authorization;
  const instanceUrl = req.headers.instanceurl;

  try {

    const query = `
      SELECT Id, ValidationName, Active, EntityDefinition.QualifiedApiName
      FROM ValidationRule
    `;

    const response = await axios.get(
      `${instanceUrl}/services/data/v59.0/tooling/query`,
      {
        headers: {
          Authorization: accessToken
        },
        params: {
          q: query
        }
      }
    );

    res.json(response.data.records);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Failed to fetch validation rules"
    });
  }
});

app.patch("/toggle-validation-rule", async (req, res) => {

  const accessToken = req.headers.authorization;
  const instanceUrl = req.headers.instanceurl;

  const { id, active } = req.body;

  try {

    // Fetch current metadata
    const existingRule = await axios.get(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${id}`,
      {
        headers: {
          Authorization: accessToken
        }
      }
    );

    // Update active status
    const updatedMetadata = {
      Metadata: {
        ...existingRule.data.Metadata,
        active: active
      }
    };

    // Deploy updated metadata
    await axios.patch(
      `${instanceUrl}/services/data/v59.0/tooling/sobjects/ValidationRule/${id}`,
      updatedMetadata,
      {
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      message: "Validation rule updated successfully"
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      error: "Failed to update validation rule"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});