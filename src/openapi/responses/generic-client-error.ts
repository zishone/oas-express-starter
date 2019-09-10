export const genericClientError = {
  description: '4XX Server Error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/genericFailResponse',
      },
    },
  },
};
