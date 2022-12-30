import Alert from "react-bootstrap/Alert";
import React, { useEffect } from "react";
import DataDiv from "./Data";
import { Switch } from "antd";
// import { useNavigate } from "react-router-dom";

export default function QueryData() {
  const [IsHistory, setHistory] = React.useState(false);
  const [formData, setFormData] = React.useState({
    args: "",
  });
  const [showErrorAlert, setShowErrorAlert] = React.useState({
    message: "",
    error: false,
    check: false,
  });
  const [apiResponse, setApiResponse] = React.useState({
    error: null,
    errorData: null,
    result: "",
    success: false,
  });

  function toggleHistory() {
    setHistory((prevMode) => !prevMode);
    console.log(IsHistory);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      if (name === "args") {
        return {
          args: value.trim(),
        };
      } else
        return {
          ...prevFormData,
        };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (formData.args.length === 0) {
      setShowErrorAlert((prevData) => {
        return {
          ...prevData,
          message: "Please enter User id",
          error: true,
          check: true,
        };
      });
      return;
    }
    try {
      // console.log(formData);
      const headers = new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      });
      fetch(
        `http://192.168.0.103:4000/channels/mychannel/chaincodes/electricLadger?args=["${
          formData.args
        }"]&peer=peer0.org1.example.com&fcn=queryData&history=${
          IsHistory ? "true" : "false"
        }`,
        {
          method: "GET",
          headers: headers,
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject({
              status: response.status, // 404
              statusText: response.statusText, // Not Found
            });
          }
        })
        .then((data) => {
          console.log(data);
          setApiResponse((prevData) => {
            return {
              ...prevData,
              ...data,
              success: true,
            };
          });
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      setShowErrorAlert(() => {
        return {
          error: true,
          ...error,
        };
      });
    }
  }
  const dangerAlert = () => {
    setShowErrorAlert(false);
  };

  useEffect(() => {
    async function checkEmpty() {
      await new Promise((resolve) => setTimeout(resolve, 10));
      // console.log(apiResponse);
      if (apiResponse.result && apiResponse.result.length === 0) {
        setShowErrorAlert((prevData) => {
          return {
            ...prevData,
            message: "not Found Please enter Valid User id",
            error: true,
          };
        });
      }
    }

    checkEmpty();
  }, [apiResponse]);

  // function checkEmpty() {
  //   console.log(apiResponse);
  //   if (apiResponse.result && apiResponse.result.length === 0) {
  //     setShowErrorAlert((prevData) => {
  //       return {
  //         ...prevData,
  //         message: "not Found Please enter Valid User id",
  //         error: true,
  //       };
  //     });
  //   }
  // }

  useEffect(() => {
    setShowErrorAlert((prevData) => {
      return {
        ...prevData,
        error: false,

        check: false,
      };
    });
  }, [formData]);
  return (
    <>
      {showErrorAlert.error && (
        <Alert
          className="mt-5"
          variant="danger"
          onClose={dangerAlert}
          dismissible
        >
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            {showErrorAlert.check
              ? showErrorAlert.message
              : `The Given ${formData.args} ${showErrorAlert.message}`}
          </p>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <br />
        <label htmlFor="uid">Please enter your user id here</label>
        <input
          id="uid"
          type="text"
          placeholder="User ID"
          onChange={handleChange}
          name="args"
          value={formData.args}
        />
        {/* <br />
        <label htmlFor="orgName">which organiation?</label>
        <br />
        <select
          id="orgName"
          value={formData.orgName}
          onChange={handleChange}
          name="orgName"
        >
          <option value="none">--Select--</option>
          <option value="Org1">Org1</option>
        </select> */}

        <br />
        <br />
        <Switch onClick={toggleHistory} />

        <button>Submit</button>
      </form>

      {apiResponse.success && <DataDiv data={apiResponse} />}
    </>
  );
}
