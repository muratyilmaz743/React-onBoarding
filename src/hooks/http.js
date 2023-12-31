import { useReducer } from "react";

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        reqIdentifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return { ...curHttpState, error: null };
    default:
      throw new Error("Action type is wrong.");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null,
  });

  const sendRequest = (url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: "SEND", identifier: reqIdentifier });

    fetch(url, {
      method: method,
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        response.json();
      })
      .then((responseData) => {
        dispatchHttp({
          type: "RESPONSE",
          responseData: responseData,
          reqExtra: reqExtra,
        });
      })
      .catch((error) => {
        dispatchHttp({ tyoe: "ERROR", errorMessage: error });
      });
  };

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.identifier,
  };
};

export default useHttp;
