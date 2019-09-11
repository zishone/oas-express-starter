export const genericClientError = {
  description: '4XX Client Error',
  content: {
    ['application/json']: {
      schema: {
        $ref: '#/components/schemas/genericFailResponse',
      },
    },
  },
};
