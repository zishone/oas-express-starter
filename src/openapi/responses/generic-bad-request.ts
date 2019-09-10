export const genericBadRequest = {
  description: '400 Bad Request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/genericFailResponse',
      },
    },
  },
};
