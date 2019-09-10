export const genericNotFound = {
  description: '404 Not Found',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/genericFailResponse',
      },
    },
  },
};
