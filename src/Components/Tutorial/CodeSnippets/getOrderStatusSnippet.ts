import { SubmitCartSampleRequestId } from "../constants";

export const getOrderStatusQuery = `query order {
  order(input: {
    paymentIntentID: ${SubmitCartSampleRequestId}
  }) {
    id
    states {
      id
      state
    }
  }
}`

export const getOrderStatusQueryOutput = `{
    "data": {
        "order": {
            "id": "${SubmitCartSampleRequestId}",
            "states": [
                {
                    "id": "8540dd-7fa4-4ee9-929a-30afef7b97",
                    "state": "ORDER_SUBMISSION_STARTED"
                },
                {
                    "id": "858f48-bbf9-48cf-b124-260a51630c",
                    "state": "ORDER_SUBMISSION_SUCCEEDED"
                },
                {
                    "id": "5fecc0-6c6c-461d-abf5-ce4cd8cba1",
                    "state": "ORDER_PLACED"
                }
            ]
        }
    }
}`