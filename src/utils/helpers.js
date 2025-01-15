import { toast } from 'react-toastify';

export const notifySuccess = (msg) => {
  toast.success(msg, {
    position: "top-right",
  });
}

export const notifyError = (error) => {
  toast.error(error, {
    position: "top-right"
  });
}

export const handleErrorResponse = (error) => {
  console.log("Error Response: ", error); // Log the entire error object

  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 422:
        // Handle validation errors
        if (data && data.msg) {
          notifyError(data.msg.join(", ")); // Display all validation errors
        }
        break;
        
      // case 401:
      //   store.dispatch(logout());
      //   break;

        case 401:
        // Handle bad request errors
        if (data && data.msg) {
          // Check if msg is an array and handle accordingly
          const errormsgs = Array.isArray(data.msg) ? data.msg : [data.msg];
          notifyError(errormsgs.join(", ")); // Join multiple msgs if needed
        } else {
          notifyError("Bad request. Please check your input.");
        }
        break;
        

      case 400:
        // Handle bad request errors
        if (data && data.msg) {
          // Check if msg is an array and handle accordingly
          const errormsgs = Array.isArray(data.msg) ? data.msg : [data.msg];
          notifyError(errormsgs.join(", ")); // Join multiple msgs if needed
        } else {
          notifyError("Bad request. Please check your input.");
        }
        break;

        case 403:
          // Handle bad request errors
          if (data && data.msg) {
            // Check if msg is an array and handle accordingly
            const errormsgs = Array.isArray(data.msg) ? data.msg : [data.msg];
            notifyError(errormsgs.join(", ")); // Join multiple msgs if needed
          } else {
            notifyError("Bad Request.");
          }
          break;

        case 404:
        // Handle bad request errors
        if (data && data.msg) {
          // Check if msg is an array and handle accordingly
          const errormsgs = Array.isArray(data.msg) ? data.msg : [data.msg];
          notifyError(errormsgs.join(", ")); // Join multiple msgs if needed
        } else {
          notifyError("Bad request. Please check your input.");
        }
        break;

      case 500:
        // Handle server errors
        if (data && data.msg) {
          const errormsgs = Array.isArray(data.msg) ? data.msg : [data.msg];
          notifyError(errormsgs.join(", ")); // Display server error msg
        }
        break;

      default:
        // Handle other status codes
        notifyError("An unexpected error occurred. Please try again later.");
        break;
    }
  } else if (error.request) {
    // Network error (e.g., no internet connection)
    notifyError("Network error. Please check your internet connection.");
  } else if (error.isAxiosError && error.code === 'ECONNABORTED') {
    // Slow network response
    notifyError("Network error: Request timeout. Please try again later.");
  } else {
    // Other unexpected errors
    notifyError("An unexpected error occurred. Please try again later.");
  }
};
