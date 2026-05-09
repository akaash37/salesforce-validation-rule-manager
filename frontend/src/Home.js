import { useEffect, useState } from "react";
import axios from "axios";

function Home() {

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access_token");
  const instanceUrl = localStorage.getItem("instance_url");

  const handleLogin = () => {
    window.location.href = "https://salesforce-validation-backend-mp45.onrender.com/auth/salesforce";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const fetchValidationRules = async () => {

    setLoading(true);

    try {

      const response = await axios.get(
        "https://salesforce-validation-backend-mp45.onrender.com/validation-rules",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            instanceurl: instanceUrl
          }
        }
      );

      setRules(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch validation rules");

    } finally {
      setLoading(false);
    }
  };

  const toggleRule = async (rule) => {

    try {

      await axios.patch(
        "https://salesforce-validation-backend-mp45.onrender.com/toggle-validation-rule",
        {
          id: rule.Id,
          active: !rule.Active
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            instanceurl: instanceUrl
          }
        }
      );

      fetchValidationRules();

    } catch (error) {

      console.log(error);

      alert("Failed to update validation rule");
    }
  };

  useEffect(() => {

    if (token) {
      fetchValidationRules();
    }

  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-blue-600 text-white p-5 shadow-lg flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Salesforce Validation Rule Manager
          </h1>

          <p className="text-sm text-blue-100">
            CloudVandana Assignment Project
          </p>
        </div>

        {token && (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
          >
            Logout
          </button>
        )}

      </div>

      <div className="p-8">

        {!token ? (

          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">

            <h2 className="text-2xl font-bold mb-4">
              Connect Salesforce
            </h2>

            <p className="text-gray-600 mb-6">
              Login to manage validation rules directly from your Salesforce org.
            </p>

            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold w-full"
            >
              Login with Salesforce
            </button>

          </div>

        ) : (

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

            <div className="flex justify-between items-center p-6 border-b">

              <div>
                <h2 className="text-xl font-bold">
                  Validation Rules
                </h2>

                <p className="text-gray-500">
                  Manage Salesforce validation rules
                </p>
              </div>

              <button
                onClick={fetchValidationRules}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Refresh
              </button>

            </div>

            {loading ? (

              <div className="p-10 text-center text-gray-500">
                Loading validation rules...
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-100">

                    <tr>

                      <th className="text-left p-4">
                        Validation Rule
                      </th>

                      <th className="text-left p-4">
                        Object
                      </th>

                      <th className="text-left p-4">
                        Status
                      </th>

                      <th className="text-left p-4">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {rules.map((rule) => (

                      <tr
                        key={rule.Id}
                        className="border-t hover:bg-gray-50"
                      >

                        <td className="p-4 font-medium">
                          {rule.ValidationName}
                        </td>

                        <td className="p-4">
                          {rule.EntityDefinition?.QualifiedApiName}
                        </td>

                        <td className="p-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              rule.Active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {rule.Active ? "Active" : "Inactive"}
                          </span>

                        </td>

                        <td className="p-4">

                          <button
                            onClick={() => toggleRule(rule)}
                            className={`px-4 py-2 rounded-lg text-white font-semibold ${
                              rule.Active
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {rule.Active ? "Deactivate" : "Activate"}
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Home;